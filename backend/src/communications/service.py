from typing import List, Optional, Dict
from datetime import datetime
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from src.database import get_session
from src.communications.models import Chat, Message, Notification
from src.auth.models import User

class CommunicationService:
    @staticmethod
    async def get_chats() -> List[Dict]:
        async with get_session() as session:
            query = select(Chat).join(User)
            result = await session.execute(query)
            chats = list(result.scalars().all())
            
            return [
                {
                    "id": str(chat.id),
                    "user": {
                        "id": str(chat.user.id),
                        "name": chat.user.name,
                        "avatar": "/placeholder.svg",
                        "isOnline": True  # В реальном приложении нужно реализовать проверку онлайн-статуса
                    },
                    "lastMessage": chat.last_message,
                    "lastMessageTime": chat.last_message_time.strftime("%H:%M"),
                    "unreadCount": chat.unread_count
                }
                for chat in chats
            ]

    @staticmethod
    async def get_chat_by_id(chat_id: str) -> Optional[Dict]:
        async with get_session() as session:
            chat_query = select(Chat).join(User).where(Chat.id == chat_id)
            chat_result = await session.execute(chat_query)
            chat = chat_result.scalar_one_or_none()
            
            if not chat:
                return None

            messages_query = select(Message).where(Message.chat_id == chat_id).order_by(Message.time)
            messages_result = await session.execute(messages_query)
            messages = list(messages_result.scalars().all())

            # Обновляем статус непрочитанных сообщений
            chat.unread_count = 0
            await session.commit()

            return {
                "chat": {
                    "id": str(chat.id),
                    "user": {
                        "id": str(chat.user.id),
                        "name": chat.user.name,
                        "avatar": "/placeholder.svg",
                        "isOnline": True
                    },
                    "lastMessage": chat.last_message,
                    "lastMessageTime": chat.last_message_time.strftime("%H:%M"),
                    "unreadCount": chat.unread_count
                },
                "messages": [
                    {
                        "id": str(message.id),
                        "text": message.text,
                        "time": message.time.strftime("%H:%M"),
                        "isOwn": message.is_own,
                        "status": message.status
                    }
                    for message in messages
                ]
            }

    @staticmethod
    async def send_message(chat_id: str, text: str) -> Optional[Dict]:
        async with get_session() as session:
            chat = await session.get(Chat, chat_id)
            if not chat:
                return None

            message = Message(
                id=str(uuid.uuid4()),
                chat_id=chat_id,
                text=text,
                is_own=True,
                status="delivered"
            )

            chat.last_message = text
            chat.last_message_time = datetime.utcnow()

            session.add(message)
            await session.commit()
            await session.refresh(message)

            return {
                "id": str(message.id),
                "text": message.text,
                "time": message.time.strftime("%H:%M"),
                "isOwn": message.is_own,
                "status": message.status
            }

    @staticmethod
    async def get_notifications() -> List[Dict]:
        async with get_session() as session:
            query = select(Notification).order_by(Notification.date.desc())
            result = await session.execute(query)
            notifications = list(result.scalars().all())
            
            return [
                {
                    "id": str(notification.id),
                    "title": notification.title,
                    "message": notification.message,
                    "date": notification.date.strftime("%d.%m.%Y %H:%M"),
                    "read": notification.read,
                    "type": notification.type,
                    "data": notification.data
                }
                for notification in notifications
            ]

    @staticmethod
    async def mark_notification_as_read(notification_id: str) -> bool:
        async with get_session() as session:
            notification = await session.get(Notification, notification_id)
            if not notification:
                return False

            notification.read = True
            await session.commit()
            return True 