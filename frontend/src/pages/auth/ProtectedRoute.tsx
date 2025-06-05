import type React from "react"
import { Navigate, Outlet } from "react-router"
import { useStore } from "@/store"

interface ProtectedRouteProps {
  children?: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
