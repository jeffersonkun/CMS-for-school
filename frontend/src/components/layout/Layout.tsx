import { Outlet } from "react-router"
import Sidebar from "./Sidebar"
import Header from "./Header"
import "./Layout.scss"

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__content">
        <Header />
        <main className="layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout