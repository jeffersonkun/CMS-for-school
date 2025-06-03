import { ReportData } from "@/types/report.types"

// Mock API function for reports
export const fetchReportData = async (reportType: string) : Promise<ReportData> => {
  // In a real app, this would be an API call with proper parameters
  return new Promise((resolve) => {
    setTimeout(() => {
      // Different data based on report type
      if (reportType === "sales") {
        resolve({
          chartData: {
            labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
            values: [12500, 18200, 15800, 22400, 19800, 28600, 42500],
          },
          metrics: [
            {
              id: "1",
              title: "Общие продажи",
              value: "₽159,800",
              change: {
                value: "12%",
                isPositive: true,
              },
            },
            {
              id: "2",
              title: "Средний чек",
              value: "₽2,360",
              change: {
                value: "3%",
                isPositive: false,
              },
            },
            {
              id: "3",
              title: "Количество заказов",
              value: "68",
              change: {
                value: "8%",
                isPositive: true,
              },
            },
            {
              id: "4",
              title: "Возвраты",
              value: "₽3,200",
              change: {
                value: "5%",
                isPositive: false,
              },
            },
          ],
          tableData: [
            { id: "1", date: "15.04.2023", orders: 12, sales: "₽42,500", average: "₽3,542" },
            { id: "2", date: "14.04.2023", orders: 10, sales: "₽28,600", average: "₽2,860" },
            { id: "3", date: "13.04.2023", orders: 8, sales: "₽19,800", average: "₽2,475" },
            { id: "4", date: "12.04.2023", orders: 15, sales: "₽22,400", average: "₽1,493" },
            { id: "5", date: "11.04.2023", orders: 7, sales: "₽15,800", average: "₽2,257" },
            { id: "6", date: "10.04.2023", orders: 9, sales: "₽18,200", average: "₽2,022" },
            { id: "7", date: "09.04.2023", orders: 7, sales: "₽12,500", average: "₽1,786" },
          ],
        })
      } else if (reportType === "products") {
        resolve({
          chartData: {
            labels: ["Молоко", "Хлеб", "Яблоки", "Сыр", "Колбаса"],
            values: [42, 38, 31, 28, 24],
          },
          metrics: [
            {
              id: "1",
              title: "Всего продано",
              value: "163",
              change: {
                value: "15%",
                isPositive: true,
              },
            },
            {
              id: "2",
              title: "Самый популярный",
              value: "Молоко",
              change: {
                value: "42 шт.",
                isPositive: true,
              },
            },
            {
              id: "3",
              title: "Средняя цена",
              value: "₽173",
              change: {
                value: "2%",
                isPositive: true,
              },
            },
            {
              id: "4",
              title: "Возвраты",
              value: "5",
              change: {
                value: "1%",
                isPositive: false,
              },
            },
          ],
          tableData: [
            { id: "1", name: "Молоко 3.2%", sold: 42, revenue: "₽3,776", stock: 58 },
            { id: "2", name: "Хлеб белый", sold: 38, revenue: "₽1,729", stock: 42 },
            { id: "3", name: "Яблоки Голден", sold: 31, revenue: "₽4,647", stock: 25 },
            { id: "4", name: "Сыр Российский", sold: 28, revenue: "₽7,277", stock: 15 },
            { id: "5", name: "Колбаса Докторская", sold: 24, revenue: "₽7,678", stock: 18 },
          ],
        })
      } else {
        // Customers report
        resolve({
          chartData: {
            labels: ["Новые", "Повторные", "Постоянные"],
            values: [24, 38, 18],
          },
          metrics: [
            {
              id: "1",
              title: "Всего клиентов",
              value: "80",
              change: {
                value: "12%",
                isPositive: true,
              },
            },
            {
              id: "2",
              title: "Новые клиенты",
              value: "24",
              change: {
                value: "8%",
                isPositive: true,
              },
            },
            {
              id: "3",
              title: "Средний чек",
              value: "₽2,360",
              change: {
                value: "3%",
                isPositive: false,
              },
            },
            {
              id: "4",
              title: "Конверсия",
              value: "5.2%",
              change: {
                value: "0.3%",
                isPositive: true,
              },
            },
          ],
          tableData: [
            { id: "1", name: "Иванов И.И.", orders: 5, spent: "₽4,250", lastOrder: "15.04.2023" },
            { id: "2", name: "Петров П.П.", orders: 3, spent: "₽1,350", lastOrder: "14.04.2023" },
            { id: "3", name: "Сидорова А.В.", orders: 7, spent: "₽8,750", lastOrder: "15.04.2023" },
            { id: "4", name: "Козлов Д.Н.", orders: 2, spent: "₽950", lastOrder: "10.04.2023" },
            { id: "5", name: "Николаева Е.С.", orders: 4, spent: "₽3,200", lastOrder: "12.04.2023" },
          ],
        })
      }
    }, 1000)
  })
}
