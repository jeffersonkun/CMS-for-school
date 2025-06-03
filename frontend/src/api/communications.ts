import type { Chat } from "@/types/product.types"; // предполагаем, что ты выделил типы

export const fetchChats = async (): Promise<Chat[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          user: {
            id: "101",
            name: "Иванов И.И.",
            avatar: "/placeholder.svg",
            isOnline: true,
          },
          lastMessage: {
            text: "Добрый день! Когда будет доставка?",
            time: "10:30",
            isRead: false,
          },
          lastMessageTime: "10:30",
          unreadCount: 2,
        },
        {
          id: "2",
          user: {
            id: "102",
            name: "Петров П.П.",
            avatar: "/placeholder.svg",
            isOnline: false,
          },
          lastMessage: {
            text: "Спасибо за информацию",
            time: "Вчера",
            isRead: true,
          },
          lastMessageTime: "Вчера",
          unreadCount: 0,
        },
        {
          id: "3",
          user: {
            id: "103",
            name: "Сидорова А.В.",
            avatar: "/placeholder.svg",
            isOnline: true,
          },
          lastMessage: {
            text: "Можно ли заменить товар?",
            time: "09:15",
            isRead: false,
          },
          lastMessageTime: "09:15",
          unreadCount: 1,
        },
      ]);
    }, 1000);
  });
};
