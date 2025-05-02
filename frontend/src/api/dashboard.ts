// Mock API function for dashboard data
export const fetchDashboardData = async () => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        todaySales: {
          value: "₽42,500",
          change: {
            value: "12%",
            isPositive: true,
          },
        },
        todayOrders: {
          value: "18",
          change: {
            value: "8%",
            isPositive: true,
          },
        },
        averageOrder: {
          value: "₽2,360",
          change: {
            value: "3%",
            isPositive: false,
          },
        },
        activeCustomers: {
          value: "156",
          change: {
            value: "24%",
            isPositive: true,
          },
        },
        salesChart: {
          labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
          values: [12500, 18200, 15800, 22400, 19800, 28600, 42500],
        },
        topProducts: [
          { id: "1", name: "Молоко 3.2%", sales: 42, amount: "₽8,400" },
          { id: "2", name: "Хлеб белый", sales: 38, amount: "₽5,700" },
          { id: "3", name: "Яблоки Голден", sales: 31, amount: "₽4,650" },
          { id: "4", name: "Сыр Российский", sales: 28, amount: "₽7,000" },
          { id: "5", name: "Колбаса Докторская", sales: 24, amount: "₽6,000" },
        ],
        recentOrders: [
          {
            id: "1",
            number: "#3245",
            customer: "Иванов И.И.",
            total: "₽3,450",
            status: "delivered",
            date: "15.04.2023",
          },
          { id: "2", number: "#3244", customer: "Петров П.П.", total: "₽1,200", status: "shipped", date: "15.04.2023" },
          { id: "3", number: "#3243", customer: "Сидорова А.В.", total: "₽2,800", status: "paid", date: "14.04.2023" },
          { id: "4", number: "#3242", customer: "Козлов Д.Н.", total: "₽950", status: "pending", date: "14.04.2023" },
          {
            id: "5",
            number: "#3241",
            customer: "Николаева Е.С.",
            total: "₽4,200",
            status: "delivered",
            date: "13.04.2023",
          },
        ],
        lowStockProducts: [
          { id: "1", name: "Молоко 3.2%", stock: 5, threshold: 10 },
          { id: "2", name: "Сметана 20%", stock: 3, threshold: 8 },
          { id: "3", name: "Масло сливочное", stock: 4, threshold: 10 },
          { id: "4", name: "Творог 9%", stock: 2, threshold: 5 },
        ],
      })
    }, 1000)
  })
}