"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { getChatById, sendMessage } from "@/api/communications"
import { Chat } from "@/types/product.types"
import "./ChatWindow.scss"

interface ChatWindowProps {
  chatId: string
}

interface Message {
  id: string
  text: string
  time: string
  isOwn: boolean
  status: "sent" | "delivered" | "read"
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchChat = async () => {
      setIsLoading(true)
      try {
        const data = await getChatById(chatId)
        setChat(data.chat)
        setMessages(data.messages)
      } catch (error) {
        console.error("Error fetching chat:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChat()
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const tempId = Date.now().toString()
    const tempMessage: Message = {
      id: tempId,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      status: "sent",
    }

    setMessages([...messages, tempMessage])
    setNewMessage("")

    try {
      const sentMessage = await sendMessage(chatId, newMessage)
      setMessages((prev) => prev.map((msg) => (msg.id === tempId ? sentMessage : msg)))
    } catch (error) {
      console.error("Error sending message:", error)
      // Handle error, maybe mark the message as failed
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isLoading) {
    return <div className="chat-window__loading">Загрузка чата...</div>
  }

  if (!chat) {
    return <div className="chat-window__error">Чат не найден</div>
  }

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <div className="chat-window__user">
          <div className="chat-window__avatar">
            {chat.user.avatar ? (
              <img src={chat.user.avatar || "/placeholder.svg"} alt={chat.user.name} />
            ) : (
              <div className="chat-window__avatar-placeholder">{chat.user.name.charAt(0)}</div>
            )}
          </div>
          <div className="chat-window__user-info">
            <h3 className="chat-window__user-name">{chat.user.name}</h3>
            <p className="chat-window__user-status">{chat.user.isOnline ? "В сети" : "Не в сети"}</p>
          </div>
        </div>
        <div className="chat-window__actions">
          <button className="chat-window__action-btn">📞</button>
          <button className="chat-window__action-btn">📎</button>
          <button className="chat-window__action-btn">⋮</button>
        </div>
      </div>

      <div className="chat-window__messages">
        <div className="chat-window__date-divider">
          <span>Сегодня</span>
        </div>

        {messages.map((message) => (
          <div key={message.id} className={`chat-window__message ${message.isOwn ? "own" : ""}`}>
            <div className="chat-window__message-content">
              <p className="chat-window__message-text">{message.text}</p>
              <div className="chat-window__message-meta">
                <span className="chat-window__message-time">{message.time}</span>
                {message.isOwn && (
                  <span className="chat-window__message-status">
                    {message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-window__input">
        <button className="chat-window__input-btn">😊</button>
        <textarea
          className="chat-window__input-field"
          placeholder="Введите сообщение..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="chat-window__send-btn" onClick={handleSendMessage} disabled={!newMessage.trim()}>
          📤
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
