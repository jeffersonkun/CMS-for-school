import { NavLink } from "react-router-dom"
import { useStore } from "@/store"
import "./Sidebar.scss"

const Sidebar = () => {
  const { user } = useStore()

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <h1>Контора</h1>
        <p>Жизнь Март</p>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}>
          <span className="sidebar__icon">📊</span>
          <span className="sidebar__text">Панель</span>
        </NavLink>

        {user?.role === "admin" && (
          <NavLink to="/users" className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}>
            <span className="sidebar__icon">👥</span>
            <span className="sidebar__text">Пользователи</span>
          </NavLink>
        )}

        <NavLink to="/products" className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}>
          <span className="sidebar__icon">🛒</span>
          <span className="sidebar__text">Товары</span>
        </NavLink>

        <NavLink to="/orders" className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}>
          <span className="sidebar__icon">📝</span>
          <span className="sidebar__text">Заказы</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}>
          <span className="sidebar__icon">📈</span>
          <span className="sidebar__text">Отчёты</span>
        </NavLink>

        <NavLink to="/communications" className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}>
          <span className="sidebar__icon">💬</span>
          <span className="sidebar__text">Коммуникации</span>
        </NavLink>

        <NavLink to="/warehouse" className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}>
          <span className="sidebar__icon">🏭</span>
          <span className="sidebar__text">Склад</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}>
          <span className="sidebar__icon">⚙️</span>
          <span className="sidebar__text">Настройки</span>
        </NavLink>
      </nav>

      <div className="sidebar__user">
        <div className="sidebar__user-avatar">{user?.name.charAt(0)}</div>
        <div className="sidebar__user-info">
          <p className="sidebar__user-name">{user?.name}</p>
          <p className="sidebar__user-role">{user?.role}</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar