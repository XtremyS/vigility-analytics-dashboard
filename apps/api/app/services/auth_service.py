from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse


def register_user(db: Session, payload: RegisterRequest) -> None:
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise ValueError("Username already exists")

    user = User(
        username=payload.username,
        password=get_password_hash(payload.password),
        age=payload.age,
        gender=payload.gender.value,
    )
    db.add(user)
    db.commit()


def login_user(db: Session, payload: LoginRequest) -> TokenResponse:
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password):
        raise ValueError("Invalid credentials")

    token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=token)
