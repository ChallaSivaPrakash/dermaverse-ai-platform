from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, TokenResponse, UserSkinUpdate
from app.services.auth_service import hash_password, verify_password, create_jwt
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    user = User(
        email=data.email, 
        hashed_password=hash_password(data.password),
        skin_type=None,
        skin_concerns=[],
        prescription_data=None
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    token = create_jwt(str(user.id), user.role)
    return TokenResponse(access_token=token, token_type="bearer")


@router.put("/profile/skin", response_model=UserOut)
async def update_skin_profile(
    data: UserSkinUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(User).where(User.id == current_user.id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    if data.skin_type is not None:
        user.skin_type = data.skin_type
    if data.skin_concerns is not None:
        user.skin_concerns = data.skin_concerns
    if data.prescription_data is not None:
        user.prescription_data = data.prescription_data
        
    await db.commit()
    await db.refresh(user)
    return user
