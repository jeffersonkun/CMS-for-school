"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchChats, fetchNotifications } from "@/api/communications"
import ChatList from "./components/ChatList"
import ChatWindow from "./components/ChatWindow"
import NotificationList from "./components/NotificationList"
import "./Communications.scss"

const Communications = () => {
  const [activeTab, setActiveTab] = useState("chats")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  const { data: chats, isLoading: chatsLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
  })

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  })

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId)
  }

  return (
    <div className="communications">
      <div className="communications__header">
        <h1 className="communications__title">Коммуникации</h1>
        <div className="communications__tabs">
          <button
            className={`communications__tab ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => setActiveTab("chats")}
          >
            Чаты
          </button>
          <button
            className={`communications__tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            Уведомления
          </button>
        </div>
      </div>

      <div className="communications__content">
        {activeTab === "chats" ? (
          <div className="communications__chats">
            <div className="communications__sidebar">
              {chatsLoading ? (
                <div className="communications__loading">Загрузка чатов...</div>
              ) : (
                  chats ? <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={handleChatSelect} /> : 'Нет чатов'
              )}
            </div>
            <div className="communications__main">
              {selectedChat ? (
                <ChatWindow chatId={selectedChat} />
              ) : (
                <div className="communications__empty">
                  <p>Выберите чат, чтобы начать общение</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="communications__notifications">
            {notificationsLoading ? (
              <div className="communications__loading">Загрузка уведомлений...</div>
            ) : (
              notifications && <NotificationList notifications={notifications} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Communications
