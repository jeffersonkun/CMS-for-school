from datetime import datetime, timedelta
from typing import Optional, List
from jose import JWTError, jwt
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from os import getenv
from dotenv import load_dotenv

from src.auth.models import User
from src.service.base import BaseService
from src.database import async_session_maker, get_session

load_dotenv()
JWT_KEY = getenv("JWT_KEY")
if not JWT_KEY:
    raise RuntimeError("JWT_KEY environment variable is not set")

class UserService(BaseService):
    model = User
    
    @classmethod
    async def get_user_by_id(cls, user_id: int) -> Optional[User]:
        """
        Получение пользователя по ID.
        
        Args:
            user_id (int): ID пользователя
            
        Returns:
            Optional[User]: Объект пользователя или None, если пользователь не найден
        """
        async with async_session_maker() as session:
            query = select(cls.model).where(cls.model.id == user_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()
    
    @classmethod
    async def verify_token(cls, token: str) -> User:
        """
        Проверка JWT токена и получение пользователя.
        
        Args:
            token (str): JWT токен
            
        Returns:
            User: Объект пользователя
            
        Raises:
            HTTPException: Если токен недействителен или пользователь не найден
        """
        credentials_exception = HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            # Декодируем JWT токен
            payload = jwt.decode(token, JWT_KEY, algorithms=["HS256"])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise credentials_exception
            # Преобразуем строковый ID в целое число
            user_id = int(user_id)
        except (JWTError, ValueError):
            raise credentials_exception
            
        user = await cls.get_user_by_id(user_id)
        if user is None:
            raise credentials_exception
            
        return user

    @staticmethod
    async def find_one_or_none(email: str) -> Optional[User]:
        async with get_session() as session:
            query = select(User).where(User.email == email)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @staticmethod
    async def add(email: str, hashed_password: str, name: str = None, role: str = "user") -> User:
        async with get_session() as session:
            user = User(
                email=email,
                hashed_password=hashed_password,
                name=name or email.split('@')[0],
                role=role
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user

    @staticmethod
    async def get_by_id(user_id: str) -> Optional[User]:
        async with get_session() as session:
            query = select(User).where(User.id == user_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @staticmethod
    async def get_all() -> List[User]:
        async with get_session() as session:
            query = select(User)
            result = await session.execute(query)
            return list(result.scalars().all())

    @staticmethod
    async def update(user_id: str, email: str, hashed_password: str) -> Optional[User]:
        async with get_session() as session:
            user = await UserService.get_by_id(user_id)
            if not user:
                return None
            
            user.email = email
            user.hashed_password = hashed_password
            await session.commit()
            await session.refresh(user)
            return user