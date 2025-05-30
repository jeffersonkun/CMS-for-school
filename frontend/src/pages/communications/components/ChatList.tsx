"use client"

import { useState } from "react"
import "./ChatList.scss"

interface Chat {
  id: string
  user: {
    name: string
    avatar?: string
  }
  lastMessage: {
    text: string
    time: string
    isRead: boolean
  }
  unreadCount: number
}

interface ChatListProps {
  chats: Chat[]
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
}

const ChatList = ({ chats, selectedChat, onSelectChat }: ChatListProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChats = chats.filter((chat) => chat.user.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="chat-list">
      <div className="chat-list__search">
        <input
          type="text"
          placeholder="Поиск чатов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="chat-list__search-input"
        />
      </div>

      <div className="chat-list__items">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-list__item ${selectedChat === chat.id ? "active" : ""}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-list__avatar">
                {chat.user.avatar ? (
                  <img src={chat.user.avatar || "/placeholder.svg"} alt={chat.user.name} />
                ) : (
                  <div className="chat-list__avatar-placeholder">{chat.user.name.charAt(0)}</div>
                )}
              </div>
              <div className="chat-list__info">
                <div className="chat-list__header">
                  <h3 className="chat-list__name">{chat.user.name}</h3>
                  <span className="chat-list__time">{chat.lastMessage.time}</span>
                </div>
                <div className="chat-list__message">
                  <p className={`chat-list__message-text ${!chat.lastMessage.isRead ? "unread" : ""}`}>
                    {chat.lastMessage.text}
                  </p>
                  {chat.unreadCount > 0 && <span className="chat-list__badge">{chat.unreadCount}</span>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="chat-list__empty">Чаты не найдены</div>
        )}
      </div>
    </div>
  )
}

export default ChatList
