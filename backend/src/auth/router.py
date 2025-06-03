from fastapi import APIRouter, HTTPException, status, Response, Depends
from fastapi.responses import JSONResponse
from typing import List
from datetime import datetime

from src.auth.auth import authenticate_user, create_access_token, get_password_hash
from src.auth.schemas import SUserAuth, SUserResponse, SUser
from src.auth.service import UserService
from src.auth.dependencies import get_current_user

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_data: SUserAuth) -> JSONResponse:
    existing_user = await UserService.find_one_or_none(email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует"
        )
    
    hashed_password = await get_password_hash(user_data.password)
    user = await UserService.add(
        email=user_data.email,
        hashed_password=hashed_password
    )
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"message": "Пользователь успешно зарегистрирован"}
    )
    
@router.post("/login", status_code=status.HTTP_200_OK)
async def login_user(response: Response, user_data: SUserAuth) -> SUserResponse:
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль"
        )
    
    access_token = await create_access_token({"sub": str(user.id)})
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        secure=True,
        samesite="lax"
    )
    
    return SUserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        access_token=access_token
    )

@router.get("/users", response_model=List[SUser])
async def get_users(current_user: SUser = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для просмотра списка пользователей"
        )
    users = await UserService.get_all()
    return users

@router.get("/users/{user_id}", response_model=SUser)
async def get_user(user_id: str, current_user: SUser = Depends(get_current_user)):
    if current_user.role != "admin" and str(current_user.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для просмотра информации о пользователе"
        )
    user = await UserService.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    return user

@router.post("/users", response_model=SUser)
async def create_user(user_data: SUserAuth, current_user: SUser = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для создания пользователей"
        )
    existing_user = await UserService.find_one_or_none(email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует"
        )
    hashed_password = await get_password_hash(user_data.password)
    user = await UserService.add(
        email=user_data.email,
        hashed_password=hashed_password
    )
    return user

@router.put("/users/{user_id}", response_model=SUser)
async def update_user(
    user_id: str,
    user_data: SUserAuth,
    current_user: SUser = Depends(get_current_user)
):
    if current_user.role != "admin" and str(current_user.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для обновления пользователя"
        )
    user = await UserService.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    hashed_password = await get_password_hash(user_data.password)
    updated_user = await UserService.update(
        user_id=user_id,
        email=user_data.email,
        hashed_password=hashed_password
    )
    return updated_user