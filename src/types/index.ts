export interface Customer {
  id: string;
  name: string;
  email: string;
  city: string;
  ltv: number;
  ordersCount: number;
}

export interface Order {
  id: string;
  date: string;
  customerId: string;
  city: string;
  channel: string;
  status: string;
  total: number;
}

export interface DashboardMetrics {
  revenue: number;
  orders: number;
  aov: number;
  conversionRate: number;
}

export interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface FilterOptions {
  period: "7d" | "30d" | "qtd" | "ytd" | "custom";
  channel: string;
  city: string;
  startDate?: string;
  endDate?: string;
}
