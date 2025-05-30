from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class UserBase(BaseModel):
    id: str
    name: str
    avatar: str
    isOnline: bool

class ChatBase(BaseModel):
    id: str
    user: UserBase
    lastMessage: str
    lastMessageTime: str
    unreadCount: int

class MessageBase(BaseModel):
    id: str
    text: str
    time: str
    isOwn: bool
    status: str

class MessageCreate(BaseModel):
    text: str

class NotificationBase(BaseModel):
    id: str
    title: str
    message: str
    date: str
    read: bool
    type: str
    data: Optional[dict] = None

class ChatResponse(BaseModel):
    chat: ChatBase
    messages: List[MessageBase]

    class Config:
        from_attributes = True 