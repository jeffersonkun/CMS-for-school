// mockDB/orders.ts
import type { Order, OrderStatus } from "@/types/product.types";

let ordersDB: Order[] = [
  {
    id: "1",
    number: "#3245",
    customer: {
      id: "101",
      name: "Иванов И.И.",
      email: "ivanov@example.com",
      phone: "+7 (999) 123-45-67",
    },
    items: [
      {
        id: "1001",
        productId: "1",
        productName: "Молоко 3.2%",
        quantity: 2,
        price: 89.9,
      },
      {
        id: "1002",
        productId: "2",
        productName: "Хлеб белый",
        quantity: 1,
        price: 45.5,
      },
    ],
    subtotal: 225.3,
    discount: 0,
    shipping: 150,
    total: 375.3,
    status: "delivered",
    paymentMethod: "Наличные при получении",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-15T15:45:00Z",
  },
  {
    id: "2",
    number: "#3244",
    customer: {
      id: "102",
      name: "Петров П.П.",
      email: "petrov@example.com",
      phone: "+7 (999) 234-56-78",
    },
    items: [
      {
        id: "1003",
        productId: "3",
        productName: "Яблоки Голден",
        quantity: 2,
        price: 149.9,
      },
    ],
    subtotal: 299.8,
    discount: 0,
    shipping: 150,
    total: 449.8,
    status: "shipped",
    paymentMethod: "Банковская карта",
    createdAt: "2023-04-15T09:15:00Z",
    updatedAt: "2023-04-15T14:20:00Z",
  },
  {
    id: "3",
    number: "#3243",
    customer: {
      id: "103",
      name: "Сидорова А.В.",
      email: "sidorova@example.com",
      phone: "+7 (999) 345-67-89",
    },
    items: [
      {
        id: "1004",
        productId: "4",
        productName: "Сыр Российский",
        quantity: 1,
        price: 259.9,
      },
      {
        id: "1005",
        productId: "5",
        productName: "Колбаса Докторская",
        quantity: 1,
        price: 319.9,
      },
    ],
    subtotal: 579.8,
    discount: 50,
    shipping: 150,
    total: 679.8,
    status: "paid",
    paymentMethod: "Банковская карта",
    createdAt: "2023-04-14T16:45:00Z",
    updatedAt: "2023-04-14T17:30:00Z",
  },
  {
    id: "4",
    number: "#3242",
    customer: {
      id: "104",
      name: "Козлов Д.Н.",
      email: "kozlov@example.com",
      phone: "+7 (999) 456-78-90",
    },
    items: [
      {
        id: "1006",
        productId: "1",
        productName: "Молоко 3.2%",
        quantity: 3,
        price: 89.9,
      },
    ],
    subtotal: 269.7,
    discount: 0,
    shipping: 150,
    total: 419.7,
    status: "pending",
    paymentMethod: "Наличные при получении",
    createdAt: "2023-04-14T14:10:00Z",
    updatedAt: "2023-04-14T14:10:00Z",
  },
  {
    id: "5",
    number: "#3241",
    customer: {
      id: "105",
      name: "Николаева Е.С.",
      email: "nikolaeva@example.com",
      phone: "+7 (999) 567-89-01",
    },
    items: [
      {
        id: "1007",
        productId: "2",
        productName: "Хлеб белый",
        quantity: 2,
        price: 45.5,
      },
      {
        id: "1008",
        productId: "3",
        productName: "Яблоки Голден",
        quantity: 1,
        price: 149.9,
      },
      {
        id: "1009",
        productId: "4",
        productName: "Сыр Российский",
        quantity: 1,
        price: 259.9,
      },
    ],
    subtotal: 500.8,
    discount: 0,
    shipping: 150,
    total: 650.8,
    status: "delivered",
    paymentMethod: "Банковская карта",
    createdAt: "2023-04-13T11:25:00Z",
    updatedAt: "2023-04-13T16:40:00Z",
  },
];

const getOrdersDB = () => ordersDB;
const setOrdersDB = (newOrders: Order[]) => {
  ordersDB = newOrders;
};

export const fetchOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getOrdersDB());
    }, 500);
  });
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = getOrdersDB().find((o) => o.id === orderId);
      if (order) {
        resolve(order);
      } else {
        reject(new Error("Order not found"));
      }
    }, 500);
  });
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus
): Promise<Order> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentOrders = getOrdersDB();
      const orderIndex = currentOrders.findIndex((o) => o.id === orderId);

      if (orderIndex === -1) {
        reject(new Error("Order not found"));
        return;
      }

      const updatedOrder = {
        ...currentOrders[orderIndex],
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      const newOrders = [...currentOrders];
      newOrders[orderIndex] = updatedOrder;
      setOrdersDB(newOrders);

      resolve(updatedOrder);
    }, 500);
  });
};

// Дополнительные CRUD операции при необходимости
export const createOrder = async (
  orderData: Partial<Order>
): Promise<Order> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        number: `#${Math.floor(1000 + Math.random() * 9000)}`,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...orderData,
      } as Order;

      const currentOrders = getOrdersDB();
      setOrdersDB([...currentOrders, newOrder]);
      resolve(newOrder);
    }, 500);
  });
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentOrders = getOrdersDB();
      const orderIndex = currentOrders.findIndex((o) => o.id === orderId);

      if (orderIndex === -1) {
        reject(new Error("Order not found"));
        return;
      }

      const newOrders = currentOrders.filter((o) => o.id !== orderId);
      setOrdersDB(newOrders);
      resolve();
    }, 500);
  });
};
export const updateOrder = async (
  orderData: Partial<Order> & { id: string }
): Promise<Order> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentOrders = getOrdersDB();
      const orderIndex = currentOrders.findIndex((o) => o.id === orderData.id);

      if (orderIndex === -1) {
        reject(new Error("Order not found"));
        return;
      }

      const updatedOrder = {
        ...currentOrders[orderIndex],
        ...orderData,
        updatedAt: new Date().toISOString(),
      };

      const newOrders = [...currentOrders];
      newOrders[orderIndex] = updatedOrder;
      setOrdersDB(newOrders);

      resolve(updatedOrder);
    }, 500);
  });
};
