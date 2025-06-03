// User types
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";


export type UserRole = "admin" | "manager" | "analyst" | "warehouse";
export type UserStatus = "active" | "inactive" | "blocked";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
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
  status: OrderStatus
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
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
  };
  lastMessageTime: string;
  unreadCount: number;
}

export interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: "info" | "warning" | "success" | "error",
}

export interface Dashboard {
  todaySales: DashboardMetric;
  todayOrders: DashboardMetric;
  averageOrder: DashboardMetric;
  activeCustomers: DashboardMetric;
  salesChart: SalesChart;
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
}

export interface DashboardMetric {
  value: string;
  change: {
    value: string;
    isPositive: boolean;
  };
}

export interface SalesChart {
  labels: string[];
  values: number[];
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  amount: string;
}

export interface RecentOrder {
  id: string;
  number: string;
  customer: string;
  total: string;
  status: OrderStatus
  date: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  threshold: number;
}
