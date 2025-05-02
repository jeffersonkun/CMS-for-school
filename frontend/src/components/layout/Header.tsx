"use client"

import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"
import { useStore } from "@/store"
import "./Header.scss"

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const { notifications } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev)
  }

  return (
    <header className="header">
      <div className="header__title">
        <h2>Панель управления</h2>
      </div>

      <div className="header__actions">
        <button
          className="header__theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="header__notifications">
          <button className="header__notifications-toggle" onClick={toggleNotifications} aria-label="Уведомления">
            🔔{notifications.length > 0 && <span className="header__notifications-badge">{notifications.length}</span>}
          </button>

          {showNotifications && (
            <div className="header__notifications-dropdown">
              <h3>Уведомления</h3>
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id} className="header__notification">
                      <p className="header__notification-text">{notification.text}</p>
                      <span className="header__notification-time">{notification.time}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="header__notifications-empty">Нет новых уведомлений</p>
              )}
            </div>
          )}
        </div>

        <div className="header__search">
          <input type="text" placeholder="Поиск..." className="header__search-input" />
          <button className="header__search-button" aria-label="Поиск">
            🔍
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header