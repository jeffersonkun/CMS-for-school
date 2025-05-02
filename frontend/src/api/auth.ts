import type { User } from "@/types/product.types"

// Mock API function for login
export const loginUser = async (email: string, password: string): Promise<User> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock authentication logic
      if (email === "admin@example.com" && password === "password") {
        resolve({
          id: "1",
          name: "Администратор",
          email: "admin@example.com",
          role: "admin",
        })
      } else if (email === "manager@example.com" && password === "password") {
        resolve({
          id: "2",
          name: "Менеджер",
          email: "manager@example.com",
          role: "manager",
        })
      } else {
        reject(new Error("Неверные учетные данные"))
      }
    }, 1000)
  })
}
