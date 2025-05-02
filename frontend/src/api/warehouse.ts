// Mock API function for warehouse
export const fetchWarehouseData = async () => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        metrics: {
          totalProducts: "156",
          totalValue: "₽458,750",
          lowStockCount: "12",
          monthlyDeliveries: "8",
        },
        inventory: [
          {
            id: "1",
            name: "Молоко 3.2%",
            sku: "MLK-001",
            category: "Молочные продукты",
            price: 89.9,
            stock: 42,
            minStock: 10,
            location: "A-1-2",
            lastDelivery: "12.04.2023",
          },
          {
            id: "2",
            name: "Хлеб белый",
            sku: "BRD-001",
            category: "Хлебобулочные изделия",
            price: 45.5,
            stock: 28,
            minStock: 15,
            location: "B-2-1",
            lastDelivery: "15.04.2023",
          },
          {
            id: "3",
            name: "Яблоки Голден",
            sku: "APL-001",
            category: "Фрукты",
            price: 149.9,
            stock: 15,
            minStock: 10,
            location: "C-3-4",
            lastDelivery: "10.04.2023",
          },
          {
            id: "4",
            name: "Сыр Российский",
            sku: "CHS-001",
            category: "Молочные продукты",
            price: 259.9,
            stock: 8,
            minStock: 10,
            location: "A-2-3",
            lastDelivery: "08.04.2023",
          },
          {
            id: "5",
            name: "Колбаса Докторская",
            sku: "SSG-001",
            category: "Мясные продукты",
            price: 319.9,
            stock: 12,
            minStock: 8,
            location: "D-1-2",
            lastDelivery: "11.04.2023",
          },
        ],
        lowStockProducts: [
          { id: "4", name: "Сыр Российский", stock: 8, minStock: 10 },
          { id: "6", name: "Сметана 20%", stock: 5, minStock: 8 },
          { id: "7", name: "Масло сливочное", stock: 4, minStock: 10 },
          { id: "8", name: "Творог 9%", stock: 3, minStock: 5 },
        ],
      })
    }, 1000)
  })
}
