from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt

from app.config import get_db, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models import User
from app import schemas

router = APIRouter()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# List of disposable email domains to block
DISPOSABLE_EMAIL_DOMAINS = {
    "10minutemail.com", "guerrillamail.com", "mailinator.com", "temp-mail.org",
    "throwaway.email", "yopmail.com", "maildrop.cc", "tempail.com", "dispostable.com",
    "0-mail.com", "anonbox.net", "binkmail.com", "deadaddress.com", "drdrb.com",
    "e4ward.com", "emailondeck.com", "fakeinbox.com", "fixmail.tk", "gishpuppy.com",
    "guerrillamail.biz", "guerrillamail.de", "guerrillamail.net", "guerrillamail.org",
    "haltospam.com", "incognitomail.org", "kasmail.com", "klzlk.com", "kurzepost.de",
    "lifebyfood.com", "lovemeleaveme.com", "mailcatch.com", "maileater.com",
    "mailexpire.com", "mailin8r.com", "mailmetrash.com", "mailnull.com", "mailshell.com",
    "mailsiphon.com", "mailtothis.com", "mailzilla.com", "meltmail.com", "mintemail.com",
    "mohmal.com", "mytrashmail.com", "nobulk.com", "noclickemail.com", "nogmailspam.info",
    "nomail.xl.cx", "nospamfor.us", "objectmail.com", "obobbo.com", "oneoffemail.com",
    "oopi.org", "opayq.com", "owlpic.com", "pookmail.com", "proxymail.eu",
    "rcpt.at", "reallymymail.com", "rhyta.com", "safe-mail.net", "saynotospams.com",
    "selfdestructingmail.com", "sendspamhere.com", "sharklasers.com", "shieldedmail.com",
    "smellfear.com", "spambob.com", "spambog.com", "spambog.de", "spambog.ru",
    "spambox.us", "spamcero.com", "spamcon.org", "spamcorptastic.com", "spamcowboy.com",
    "spamcowboy.net", "spamcowboy.org", "spamday.com", "spamex.com", "spamfree24.com",
    "spamfree24.eu", "spamfree24.org", "spamgourmet.com", "spamgourmet.net",
    "spamgourmet.org", "spamhole.com", "spamify.com", "spaminator.de", "spamkill.info",
    "spaml.com", "spaml.de", "spammotel.com", "spamobox.com", "spamspot.com",
    "spamthis.co.uk", "spamthisplease.com", "superrito.com", "suremail.info",
    "tempalias.com", "tempe-mail.com", "tempemail.biz", "tempemail.com", "tempinbox.co.uk",
    "tempinbox.com", "temp-mail.ru", "thankyou2010.com", "thisisnotmyrealemail.com",
    "throam.com", "tilien.com", "tmailinator.com", "tradermail.info", "trash2009.com",
    "trashemail.de", "trashmail.at", "trashmail.com", "trashmail.net", "trashmail.org",
    "trashymail.com", "tyldd.com", "upliftnow.com", "uplipht.com", "venompen.com",
    "veryrealemail.com", "walkmail.net", "wetrainbayarea.com", "wetrainbayarea.org",
    "wh4f.org", "whyspam.me", "willselfdestruct.com", "xoxy.net", "yogamaven.com",
    "yuurok.com", "zehnminutenmail.de", "zetmail.com", "zippymail.info", "zoemail.org"
}

def is_disposable_email(email: str) -> bool:
    """Check if email domain is from a disposable email service"""
    try:
        domain = email.split('@')[1].lower()
        return domain in DISPOSABLE_EMAIL_DOMAINS
    except IndexError:
        return False

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check for disposable email
    if is_disposable_email(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Disposable email addresses are not allowed. Please use a permanent email address."
        )
    
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = hash_password(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.LoginRequest, db: Session = Depends(get_db)):
    # Find user by email
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

def get_token_from_header(authorization: str = Header(None)) -> str:
    """Extract Bearer token from Authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    return authorization.split(" ")[1]

def get_current_user(token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user
