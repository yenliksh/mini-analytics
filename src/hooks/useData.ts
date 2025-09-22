import { useQuery } from "@tanstack/react-query";
import { Customer, Order, DashboardMetrics, ChartData, FilterOptions } from "@/types";

// Mock data loading functions
const loadCustomers = async (): Promise<Customer[]> => {
  const response = await fetch("/data/customers.json");
  const data = await response.json();
  return data.customers;
};

const loadOrders = async (): Promise<Order[]> => {
  const response = await fetch("/data/orders.json");
  const data = await response.json();
  return data.orders;
};

// Custom hooks
export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: loadCustomers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: loadOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardMetrics = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ["dashboard-metrics", filters],
    queryFn: async (): Promise<DashboardMetrics> => {
      const orders = await loadOrders();
      const customers = await loadCustomers();
      
      // Apply filters
      let filteredOrders = orders;
      
      // Filter by period
      const now = new Date();
      let startDate: Date;
      
      switch (filters.period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'qtd':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'ytd':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'custom':
          startDate = filters.startDate ? new Date(filters.startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      const endDate = filters.endDate ? new Date(filters.endDate) : now;
      
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate;
      });
      
      // Filter by channel
      if (filters.channel && filters.channel !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.channel === filters.channel);
      }
      
      // Filter by city
      if (filters.city && filters.city !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.city === filters.city);
      }
      
      // Calculate metrics
      const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
      const ordersCount = filteredOrders.length;
      const aov = ordersCount > 0 ? revenue / ordersCount : 0;
      
      // Mock conversion rate (in real app, this would come from analytics)
      const conversionRate = 0.15; // 15%
      
      return {
        revenue,
        orders: ordersCount,
        aov,
        conversionRate,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useChartData = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ["chart-data", filters],
    queryFn: async (): Promise<ChartData[]> => {
      const orders = await loadOrders();
      
      // Apply same filters as metrics
      let filteredOrders = orders;
      
      const now = new Date();
      let startDate: Date;
      
      switch (filters.period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'qtd':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'ytd':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'custom':
          startDate = filters.startDate ? new Date(filters.startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      const endDate = filters.endDate ? new Date(filters.endDate) : now;
      
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate;
      });
      
      if (filters.channel && filters.channel !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.channel === filters.channel);
      }
      
      if (filters.city && filters.city !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.city === filters.city);
      }
      
      // Group by date
      const groupedData = filteredOrders.reduce((acc, order) => {
        const date = order.date;
        if (!acc[date]) {
          acc[date] = { date, revenue: 0, orders: 0 };
        }
        acc[date].revenue += order.total;
        acc[date].orders += 1;
        return acc;
      }, {} as Record<string, ChartData>);
      
      return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
