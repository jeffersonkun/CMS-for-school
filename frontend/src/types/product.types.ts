// User types
export type UserRole = "admin" | "manager" | "analyst" | "warehouse"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  lastActive: string
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  sku: string
  price: number
  stock: number
  category: string
  attributes: Record<string, string>
  images: string[]
  createdAt: string
  updatedAt: string
}

// Order types
export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface OrderCustomer {
  id: string
  name: string
  email: string
  phone: string
}

export interface Order {
  id: string
  number: string
  customer: OrderCustomer
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

// Communication types
export interface Message {
  id: string
  text: string
  time: string
  isOwn: boolean
  status: "sent" | "delivered" | "read"
}

export interface Chat {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
    isOnline: boolean
  }
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}
