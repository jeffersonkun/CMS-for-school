import { useState } from "react";
import { useStore } from "@/store";
import { useTheme } from "@/context/ThemeContext";
import ProfileSettings from "./components/ProfileSettings";
import SecuritySettings from "./components/SecuritySettings";
import NotificationSettings from "./components/NotificationSettings";
import "./Settings.scss";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings">
      <div className="settings__header">
        <h1 className="settings__title">Настройки</h1>
      </div>

      <div className="settings__content">
        <div className="settings__sidebar">
          <div className="settings__user">
            <div className="settings__user-avatar">
              <div className="settings__user-avatar-placeholder">
                {user?.name.charAt(0)}
              </div>
            </div>
            <div className="settings__user-info">
              <h3 className="settings__user-name">{user?.name}</h3>
              <p className="settings__user-role">{user?.role}</p>
            </div>
          </div>

          <nav className="settings__nav">
            <button
              className={`settings__nav-item ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Профиль
            </button>
            <button
              className={`settings__nav-item ${
                activeTab === "security" ? "active" : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              Безопасность
            </button>
            <button
              className={`settings__nav-item ${
                activeTab === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              Уведомления
            </button>
          </nav>

          <div className="settings__theme">
            <span className="settings__theme-label">Тема:</span>
            <button
              className="settings__theme-toggle"
              onClick={toggleTheme}
            >
              {theme === "light" ? "🌙 Тёмная" : "☀️ Светлая"}
            </button>
          </div>
        </div>

        <div className="settings__main">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && <NotificationSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
