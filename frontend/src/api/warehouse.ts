import type { WarehouseData } from "@/types/warehouse.types";

export const fetchWarehouseData = async (): Promise<WarehouseData> => {
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
          // ...
        ],
        lowStockProducts: [
          { id: "4", name: "Сыр Российский", stock: 8, minStock: 10 },
          // ...
        ],
      });
    }, 1000);
  });
};
