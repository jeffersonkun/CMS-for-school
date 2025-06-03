export interface WarehouseMetrics {
  totalProducts: string; // Можно заменить на number, если нужно число
  totalValue: string; // ₽... — оставляем string
  lowStockCount: string;
  monthlyDeliveries: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  location: string;
  lastDelivery: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  minStock: number;
}

export interface WarehouseData {
  metrics: WarehouseMetrics;
  inventory: InventoryItem[];
  lowStockProducts: LowStockProduct[];
}
