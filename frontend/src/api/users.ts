import type { User } from "@/types/product.types";

export const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "Администратор",
          email: "admin@example.com",
          role: "admin",
          status: "active",
          lastActive: "15.04.2023 12:30",
        },
        {
          id: "2",
          name: "Менеджер",
          email: "manager@example.com",
          role: "manager",
          status: "active",
          lastActive: "15.04.2023 10:15",
        },
        {
          id: "3",
          name: "Аналитик",
          email: "analyst@example.com",
          role: "analyst",
          status: "inactive",
          lastActive: "10.04.2023 15:45",
        },
        {
          id: "4",
          name: "Складской работник",
          email: "warehouse@example.com",
          role: "warehouse",
          status: "blocked",
          lastActive: "15.04.2023 09:20",
        },
      ]);
    }, 1000);
  });
};

export const getUserById = async (userId: string): Promise<User> => {
  const users = await fetchUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  return user;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name ?? "",
        email: userData.email ?? "",
        role: userData.role ?? "manager",
        status: userData.status ?? "active",
        lastActive: new Date().toLocaleString("ru-RU"),
      });
    }, 1000);
  });
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: userData.name ?? "",
        email: userData.email ?? "",
        role: userData.role ?? "manager",
        status: userData.status ?? "active",
        lastActive: new Date().toLocaleString("ru-RU"),
      });
    }, 1000);
  });
};
