import { useState } from "react"
import "./NotificationList.scss"

interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}

interface NotificationListProps {
  notifications: Notification[]
}

const NotificationList = ({ notifications }: NotificationListProps) => {
  const [readNotifications, setReadNotifications] = useState<Record<string, boolean>>({})

  const markAsRead = (id: string) => {
    setReadNotifications((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const markAllAsRead = () => {
    const allRead: Record<string, boolean> = {}
    notifications.forEach((notification) => {
      allRead[notification.id] = true
    })
    setReadNotifications(allRead)
  }

  const isRead = (notification: Notification): boolean => {
    return notification.read || readNotifications[notification.id] || false
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return "ℹ️"
      case "warning":
        return "⚠️"
      case "success":
        return "✅"
      case "error":
        return "❌"
      default:
        return "📌"
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="notification-list notification-list--empty">
        <p>Нет новых уведомлений</p>
      </div>
    )
  }

  return (
    <div className="notification-list">
      <div className="notification-list__header">
        <h3 className="notification-list__title">Уведомления</h3>
        <button className="notification-list__action" onClick={markAllAsRead}>
          Отметить все как прочитанные
        </button>
      </div>

      <div className="notification-list__items">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-list__item ${isRead(notification) ? "notification-list__item--read" : ""} notification-list__item--${notification.type}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="notification-list__icon">{getNotificationIcon(notification.type)}</div>
            <div className="notification-list__content">
              <h4 className="notification-list__item-title">{notification.title}</h4>
              <p className="notification-list__message">{notification.message}</p>
              <span className="notification-list__date">{notification.date}</span>
            </div>
            {!isRead(notification) && <div className="notification-list__unread-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationList
