import type { User } from "@/types/product.types"

// Mock API functions for users
export const fetchUsers = async (): Promise<User[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "Администратор",
          email: "admin@example.com",
          role: "admin",
          lastActive: "15.04.2023 12:30",
        },
        {
          id: "2",
          name: "Менеджер",
          email: "manager@example.com",
          role: "manager",
          lastActive: "15.04.2023 10:15",
        },
        {
          id: "3",
          name: "Аналитик",
          email: "analyst@example.com",
          role: "analyst",
          lastActive: "10.04.2023 15:45",
        },
        {
          id: "4",
          name: "Складской работник",
          email: "warehouse@example.com",
          role: "warehouse",
          lastActive: "15.04.2023 09:20",
        },
      ])
    }, 1000)
  })
}

export const getUserById = async (userId: string): Promise<User> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = [
        {
          id: "1",
          name: "Администратор",
          email: "admin@example.com",
          role: "admin" as const,
          lastActive: "15.04.2023 12:30",
        },
        {
          id: "2",
          name: "Менеджер",
          email: "manager@example.com",
          role: "manager" as const,
          lastActive: "15.04.2023 10:15",
        },
        {
          id: "3",
          name: "Аналитик",
          email: "analyst@example.com",
          role: "analyst" as const,
          lastActive: "10.04.2023 15:45",
        },
        {
          id: "4",
          name: "Складской работник",
          email: "warehouse@example.com",
          role: "warehouse" as const,
          lastActive: "15.04.2023 09:20",
        },
      ]

      const user = users.find((u) => u.id === userId)
      if (user) {
        resolve(user)
      } else {
        reject(new Error("User not found"))
      }
    }, 1000)
  })
}

export const createUser = async (userData: Partial<User>): Promise<User> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        lastActive: new Date().toLocaleString("ru-RU"),
      } as User)
    }, 1000)
  })
}

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        ...userData,
        lastActive: new Date().toLocaleString("ru-RU"),
      } as User)
    }, 1000)
  })
}