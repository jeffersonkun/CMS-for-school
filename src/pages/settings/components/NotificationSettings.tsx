"use client"

import { useState } from "react"
import "./NotificationSettings.scss"

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    orders: true,
    inventory: true,
    messages: true,
    system: false,
    marketing: false,
  })

  const [pushNotifications, setPushNotifications] = useState({
    orders: true,
    inventory: true,
    messages: true,
    system: true,
    marketing: false,
  })

  const handleEmailChange = (key: keyof typeof emailNotifications) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: !emailNotifications[key],
    })
  }

  const handlePushChange = (key: keyof typeof pushNotifications) => {
    setPushNotifications({
      ...pushNotifications,
      [key]: !pushNotifications[key],
    })
  }

  const handleSave = async () => {
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Notification settings saved:", { emailNotifications, pushNotifications })
    alert("Настройки уведомлений сохранены")
  }

  return (
    <div className="notification-settings">
      <div className="notification-settings__header">
        <h2 className="notification-settings__title">Настройки уведомлений</h2>
      </div>

      <div className="notification-settings__section">
        <h3 className="notification-settings__section-title">Email уведомления</h3>
        <div className="notification-settings__options">
          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Заказы</h4>
              <p className="notification-settings__option-description">
                Уведомления о новых заказах, изменениях статуса и доставке
              </p>
            </div>
            <label className="notification-settings__switch">
              <input type="checkbox" checked={emailNotifications.orders} onChange={() => handleEmailChange("orders")} />
              <span className="notification-settings__slider"></span>
            </label>
          </div>

          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Склад</h4>
              <p className="notification-settings__option-description">
                Уведомления о низком остатке товаров и поступлениях
              </p>
            </div>
            <label className="notification-settings__switch">
              <input
                type="checkbox"
                checked={emailNotifications.inventory}
                onChange={() => handleEmailChange("inventory")}
              />
              <span className="notification-settings__slider"></span>
            </label>
          </div>

          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Сообщения</h4>
              <p className="notification-settings__option-description">Уведомления о новых сообщениях от клиентов</p>
            </div>
            <label className="notification-settings__switch">
              <input
                type="checkbox"
                checked={emailNotifications.messages}
                onChange={() => handleEmailChange("messages")}
              />
              <span className="notification-settings__slider"></span>
            </label>
          </div>

          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Системные</h4>
              <p className="notification-settings__option-description">
                Уведомления о системных событиях и обновлениях
              </p>
            </div>
            <label className="notification-settings__switch">
              <input type="checkbox" checked={emailNotifications.system} onChange={() => handleEmailChange("system")} />
              <span className="notification-settings__slider"></span>
            </label>
          </div>

          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Маркетинг</h4>
              <p className="notification-settings__option-description">Новости, акции и маркетинговые материалы</p>
            </div>
            <label className="notification-settings__switch">
              <input
                type="checkbox"
                checked={emailNotifications.marketing}
                onChange={() => handleEmailChange("marketing")}
              />
              <span className="notification-settings__slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="notification-settings__section">
        <h3 className="notification-settings__section-title">Push уведомления</h3>
        <div className="notification-settings__options">
          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Заказы</h4>
              <p className="notification-settings__option-description">
                Уведомления о новых заказах, изменениях статуса и доставке
              </p>
            </div>
            <label className="notification-settings__switch">
              <input type="checkbox" checked={pushNotifications.orders} onChange={() => handlePushChange("orders")} />
              <span className="notification-settings__slider"></span>
            </label>
          </div>

          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Склад</h4>
              <p className="notification-settings__option-description">
                Уведомления о низком остатке товаров и поступлениях
              </p>
            </div>
            <label className="notification-settings__switch">
              <input
                type="checkbox"
                checked={pushNotifications.inventory}
                onChange={() => handlePushChange("inventory")}
              />
              <span className="notification-settings__slider"></span>
            </label>
          </div>

          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Сообщения</h4>
              <p className="notification-settings__option-description">Уведомления о новых сообщениях от клиентов</p>
            </div>
            <label className="notification-settings__switch">
              <input
                type="checkbox"
                checked={pushNotifications.messages}
                onChange={() => handlePushChange("messages")}
              />
              <span className="notification-settings__slider"></span>
            </label>
          </div>

          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Системные</h4>
              <p className="notification-settings__option-description">
                Уведомления о системных событиях и обновлениях
              </p>
            </div>
            <label className="notification-settings__switch">
              <input type="checkbox" checked={pushNotifications.system} onChange={() => handlePushChange("system")} />
              <span className="notification-settings__slider"></span>
            </label>
          </div>

          <div className="notification-settings__option">
            <div className="notification-settings__option-info">
              <h4 className="notification-settings__option-title">Маркетинг</h4>
              <p className="notification-settings__option-description">Новости, акции и маркетинговые материалы</p>
            </div>
            <label className="notification-settings__switch">
              <input
                type="checkbox"
                checked={pushNotifications.marketing}
                onChange={() => handlePushChange("marketing")}
              />
              <span className="notification-settings__slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="notification-settings__actions">
        <button className="notification-settings__save-button" onClick={handleSave}>
          Сохранить настройки
        </button>
      </div>
    </div>
  )
}

export default NotificationSettings
