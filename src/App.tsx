import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/dashboard/Dashboard"
import Users from "./pages/users/Users"
import Products from "./pages/products/Products"
import Orders from "./pages/orders/Orders"
import Reports from "./pages/reports/Reports"
import Communications from "./pages/communications/Communications"
import Settings from "./pages/settings/Settings"
import Warehouse from "./pages/warehouse/Warehouse"
import Login from "./pages/auth/Login"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { ThemeProvider } from "./context/ThemeContext"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/communications" element={<Communications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/warehouse" element={<Warehouse />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
