import base64
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


class TokenEncryptionError(ValueError):
    pass


def _get_encryption_key() -> bytes:
    encoded_key = os.getenv("TOKEN_ENCRYPTION_KEY", "").strip()
    if not encoded_key:
        raise TokenEncryptionError("TOKEN_ENCRYPTION_KEY is not configured")

    try:
        key = base64.b64decode(encoded_key)
    except Exception as exc:  # pragma: no cover - defensive parsing
        raise TokenEncryptionError("TOKEN_ENCRYPTION_KEY is not valid base64") from exc

    if len(key) != 32:
        raise TokenEncryptionError(
            "TOKEN_ENCRYPTION_KEY must decode to 32 bytes for AES-256"
        )
    return key


def encrypt_token(plain_text: str) -> str:
    key = _get_encryption_key()
    aes = AESGCM(key)
    nonce = os.urandom(12)
    cipher_text = aes.encrypt(nonce, plain_text.encode("utf-8"), None)
    return base64.b64encode(nonce + cipher_text).decode("utf-8")


def decrypt_token(cipher_text_b64: str) -> str:
    key = _get_encryption_key()
    raw = base64.b64decode(cipher_text_b64)
    nonce = raw[:12]
    cipher_text = raw[12:]
    aes = AESGCM(key)
    plain = aes.decrypt(nonce, cipher_text, None)
    return plain.decode("utf-8")
