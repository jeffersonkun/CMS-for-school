from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict

from src.communications.schemas import ChatResponse, MessageCreate, NotificationBase
from src.communications.service import CommunicationService
from src.auth.dependencies import get_current_user
from src.auth.schemas import SUser

router = APIRouter()

@router.get("/chats", response_model=List[Dict])
async def get_chats(current_user: SUser = Depends(get_current_user)):
    return await CommunicationService.get_chats()

@router.get("/chats/{chat_id}", response_model=ChatResponse)
async def get_chat(
    chat_id: str,
    current_user: SUser = Depends(get_current_user)
):
    chat = await CommunicationService.get_chat_by_id(chat_id)
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Чат не найден"
        )
    return chat

@router.post("/chats/{chat_id}/messages", response_model=Dict)
async def send_message(
    chat_id: str,
    message: MessageCreate,
    current_user: SUser = Depends(get_current_user)
):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для отправки сообщений"
        )
    
    sent_message = await CommunicationService.send_message(chat_id, message.text)
    if not sent_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Чат не найден"
        )
    return sent_message

@router.get("/notifications", response_model=List[NotificationBase])
async def get_notifications(current_user: SUser = Depends(get_current_user)):
    return await CommunicationService.get_notifications()

@router.post("/notifications/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: str,
    current_user: SUser = Depends(get_current_user)
):
    success = await CommunicationService.mark_notification_as_read(notification_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Уведомление не найдено"
        )
    return {"status": "success"} 