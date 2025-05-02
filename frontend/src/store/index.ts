import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { User, Notification } from "@/types/product.types"
import { loginUser } from "@/api/auth"

interface StoreState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  notifications: Notification[]
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        notifications: [],

        login: async (email: string, password: string) => {
          set({ isLoading: true })
          try {
            const user = await loginUser(email, password)
            set({ user, isAuthenticated: true, isLoading: false })
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        logout: () => {
          set({ user: null, isAuthenticated: false })
        },

        addNotification: (notification: Notification) => {
          set((state) => ({
            notifications: [notification, ...state.notifications],
          }))
        },

        removeNotification: (id: string) => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }))
        },

        clearNotifications: () => {
          set({ notifications: [] })
        },
      }),
      {
        name: "crm-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  ),
)