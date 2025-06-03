export interface ChartData {
  labels: string[];
  values: number[];
}

export interface Metric {
  id: string;
  title: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
  };
}

// --- Таблицы по типам отчётов:

export interface SalesTableRow extends Record<string, unknown> {
  id: string;
  date: string;
  orders: number;
  sales: string;
  average: string;
}

export interface ProductsTableRow extends Record<string, unknown> {
  id: string;
  name: string;
  sold: number;
  revenue: string;
  stock: number;
}

export interface CustomersTableRow extends Record<string, unknown> {
  id: string;
  name: string;
  orders: number;
  spent: string;
  lastOrder: string;
}


// --- Объединённые типы отчётов:

export interface SalesReport {
  chartData: ChartData;
  metrics: Metric[];
  tableData: SalesTableRow[];
}

export interface ProductsReport {
  chartData: ChartData;
  metrics: Metric[];
  tableData: ProductsTableRow[];
}

export interface CustomersReport {
  chartData: ChartData;
  metrics: Metric[];
  tableData: CustomersTableRow[];
}

export type ReportType = "sales" | "products" | "customers";

export type ReportData = SalesReport | ProductsReport | CustomersReport;
