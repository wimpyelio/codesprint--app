import logging
from datetime import timedelta
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, status
from jose import JWTError, jwt
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI,
    SECRET_KEY,
    get_db,
)
from app.models import User
from app.utils.auth import create_access_token, get_current_user
from app.utils.crypto import TokenEncryptionError, encrypt_token

router = APIRouter()
logger = logging.getLogger(__name__)


def _require_github_env() -> None:
    missing = []
    if not GITHUB_CLIENT_ID:
        missing.append("GITHUB_CLIENT_ID")
    if not GITHUB_CLIENT_SECRET:
        missing.append("GITHUB_CLIENT_SECRET")
    if not GITHUB_REDIRECT_URI:
        missing.append("GITHUB_REDIRECT_URI")
    if missing:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Missing OAuth configuration: {', '.join(missing)}",
        )


def _build_oauth_state() -> str:
    return create_access_token(
        data={"sub": "github_oauth_state", "purpose": "github_oauth_state"},
        expires_delta=timedelta(minutes=10),
    )


def _validate_oauth_state(state_token: str) -> None:
    try:
        payload = jwt.decode(state_token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OAuth state",
        ) from exc

    if payload.get("purpose") != "github_oauth_state":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OAuth state",
        )


@router.get("/login-url")
async def github_login_url() -> dict[str, str]:
    _require_github_env()
    state_token = _build_oauth_state()
    params = {
        "client_id": GITHUB_CLIENT_ID,
        "redirect_uri": GITHUB_REDIRECT_URI,
        "scope": "repo user:email",
        "state": state_token,
    }
    return {
        "authorize_url": f"https://github.com/login/oauth/authorize?{urlencode(params)}",
        "state": state_token,
    }


@router.get("/callback")
async def github_callback(
    code: str = Query(..., min_length=8),
    state: str | None = Query(None),
    db: Session = Depends(get_db),
) -> dict:
    # [x] Step 2 - GitHub OAuth callback implemented with encrypted token storage.
    _require_github_env()
    if state:
        _validate_oauth_state(state)

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": GITHUB_REDIRECT_URI,
                    "state": state,
                },
            )

            if token_response.status_code >= 400:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to exchange GitHub OAuth code",
                )

            token_payload = token_response.json()
            github_access_token = token_payload.get("access_token")
            if not github_access_token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=token_payload.get(
                        "error_description",
                        "GitHub token not received",
                    ),
                )

            github_headers = {
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {github_access_token}",
                "X-GitHub-Api-Version": "2022-11-28",
            }

            user_response = await client.get(
                "https://api.github.com/user",
                headers=github_headers,
            )
            if user_response.status_code >= 400:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to fetch GitHub user profile",
                )
            github_user = user_response.json()

            github_handle = github_user.get("login")
            if not github_handle:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="GitHub handle missing from OAuth profile",
                )

            email = github_user.get("email")
            if not email:
                emails_response = await client.get(
                    "https://api.github.com/user/emails",
                    headers=github_headers,
                )
                if emails_response.status_code < 400:
                    emails_payload = emails_response.json()
                    if isinstance(emails_payload, list) and emails_payload:
                        primary = next(
                            (entry for entry in emails_payload if entry.get("primary")),
                            emails_payload[0],
                        )
                        email = primary.get("email")

            if not email:
                email = f"{github_handle}@users.noreply.github.com"
    except httpx.HTTPError as exc:
        logger.exception("GitHub OAuth transport error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="GitHub OAuth request failed",
        ) from exc

    try:
        github_token_encrypted = encrypt_token(github_access_token)
    except TokenEncryptionError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    user = db.query(User).filter(User.github_handle == github_handle).first()
    if not user:
        user = db.query(User).filter(User.email == email).first()

    if user:
        user.github_handle = github_handle
        user.username = github_handle
        user.email = email
        user.full_name = github_user.get("name") or user.full_name
        user.github_token_enc = github_token_encrypted
        user.is_active = True
        if user.rank is None:
            user.rank = "Curious"
        if user.xp is None:
            user.xp = 0
        if user.streak_days is None:
            user.streak_days = 0
    else:
        user = User(
            email=email,
            username=github_handle,
            full_name=github_user.get("name"),
            hashed_password=None,
            is_active=True,
            xp=0,
            level=1,
            rank="Curious",
            streak_days=0,
            github_handle=github_handle,
            github_token_enc=github_token_encrypted,
        )
        db.add(user)

    try:
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        logger.exception("GitHub OAuth upsert failed for handle=%s", github_handle)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save OAuth user session",
        ) from exc
    db.refresh(user)

    access_token = create_access_token(
        data={"sub": user.email or str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "session_expires_minutes": ACCESS_TOKEN_EXPIRE_MINUTES,
        "user": {
            "id": user.id,
            "github_handle": user.github_handle,
            "email": user.email,
            "xp": user.xp,
            "rank": user.rank,
            "streak_days": user.streak_days,
        },
    }


@router.get("/status")
async def github_status(current_user: User = Depends(get_current_user)) -> dict:
    return {
        "connected": bool(current_user.github_handle and current_user.github_token_enc),
        "github_handle": current_user.github_handle,
    }
