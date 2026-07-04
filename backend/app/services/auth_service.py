from passlib.context import CryptContext
from jose import jwt
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_jwt(user_id: str, role: str) -> str:
    # INTENTIONAL FLAW: No expiration set on token
    payload = {"sub": str(user_id), "role": role}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def decode_jwt(token: str) -> dict:
    # INTENTIONAL FLAW: options={"verify_exp": False} — no expiry check
    return jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=["HS256"],
        options={"verify_exp": False},
    )
