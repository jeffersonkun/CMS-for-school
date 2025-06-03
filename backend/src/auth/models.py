from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.database import Base


class User(Base):
    """Модель пользователя в базе данных."""
    
    __tablename__ = "users"
    
    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String, default="user")
    
    # Relationships
    conference_registrations = relationship("ConferenceRegistration", back_populates="user")
    waiting_list_entries = relationship("WaitingList", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    chats = relationship("Chat", back_populates="user")
    orders = relationship("Order", back_populates="user")