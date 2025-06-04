import type { Chat, Message, Notification } from "@/types/product.types";

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

export const getChatById = async (
  chatId: string
): Promise<{ chat: Chat; messages: Message[] }> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const chats: Chat[] = [
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
          lastMessageTime: "10:30",
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
          lastMessageTime: "10:30",
          unreadCount: 1,
        },
      ];

      const chat = chats.find((c) => c.id === chatId) || chats[0];

      const messages: Message[] = [
        {
          id: "1",
          text: "Здравствуйте! Чем могу помочь?",
          time: "09:00",
          isOwn: true,
          status: "read",
        },
        {
          id: "2",
          text: "Добрый день! Когда будет доставка моего заказа #3245?",
          time: "09:05",
          isOwn: false,
          status: "read",
        },
        {
          id: "3",
          text: "Сейчас проверю информацию по вашему заказу",
          time: "09:07",
          isOwn: true,
          status: "read",
        },
        {
          id: "4",
          text: "Ваш заказ будет доставлен сегодня с 14:00 до 18:00",
          time: "09:10",
          isOwn: true,
          status: "read",
        },
        {
          id: "5",
          text: "Спасибо за информацию!",
          time: "09:12",
          isOwn: false,
          status: "read",
        },
      ];

      resolve({ chat, messages });
    }, 1000);
  });
};

export const sendMessage = async (
  text: string
): Promise<Message> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
        status: "delivered" as const,
      });
    }, 500);
  });
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          title: "Новый заказ",
          message: "Поступил новый заказ #3246",
          date: "15.04.2023 11:30",
          read: false,
          type: "info",
        },
        {
          id: "2",
          title: "Низкий остаток",
          message: "Товар 'Молоко 3.2%' заканчивается на складе",
          date: "15.04.2023 10:15",
          read: false,
          type: "warning",
        },
        {
          id: "3",
          title: "Заказ доставлен",
          message: "Заказ #3245 успешно доставлен",
          date: "15.04.2023 09:45",
          read: true,
          type: "success",
        },
        {
          id: "4",
          title: "Ошибка оплаты",
          message: "Не удалось обработать платеж для заказа #3244",
          date: "14.04.2023 16:20",
          read: true,
          type: "error",
        },
      ]);
    }, 1000);
  });
};