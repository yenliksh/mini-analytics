"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useDashboardMetrics, useChartData } from "@/hooks/useData";
import { FilterOptions } from "@/types";
import {
  Filter,
  Download,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Target,
} from "lucide-react";
import { usePersistedState } from "@/hooks/usePersistedState";
import { useLocale } from "@/context/LocaleContext";

const periodOptions = [
  { value: "7d", label: "7 дней" },
  { value: "30d", label: "30 дней" },
  { value: "qtd", label: "Квартал" },
  { value: "ytd", label: "Год" },
  { value: "custom", label: "Выбрать период" },
];

const channelOptions = [
  { value: "all", label: "Все каналы" },
  { value: "Web", label: "Web" },
  { value: "Mobile", label: "Mobile" },
  { value: "Offline", label: "Offline" },
];

const cityOptions = [
  { value: "all", label: "Все города" },
  { value: "Алматы", label: "Алматы" },
  { value: "Астана", label: "Астана" },
  { value: "Атырау", label: "Атырау" },
  { value: "Шымкент", label: "Шымкент" },
];

export default function Dashboard() {
  const { t } = useLocale();
  const [filters, setFilters] = usePersistedState<FilterOptions>(
    "dashboard-filters",
    {
      period: "30d",
      channel: "all",
      city: "all",
    }
  );

  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
  } = useDashboardMetrics(filters);

  const {
    data: chartData,
    isLoading: chartLoading,
    isError: chartError,
  } = useChartData(filters);

  const handleExport = () => {
    if (!chartData) return;

    const csvContent = [
      ["Дата", "Выручка", "Заказы"],
      ...chartData.map((item) => [item.date, item.revenue, item.orders]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics-${filters.period}-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "KZT",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("ru-RU").format(num);

  if (metricsError || chartError) {
    return (
      <div className="p-6 text-red-500">
        Ошибка загрузки данных. Попробуйте обновить страницу.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Фильтры дашборда</SheetTitle>
                <SheetDescription>
                  Настройте параметры отображения данных
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-sm font-medium">Период</label>
                  <select
                    aria-label="Выбор периода"
                    value={filters.period}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        period: e.target.value as any,
                      }))
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {periodOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Канал продаж</label>
                  <select
                    aria-label="Фильтр по каналу"
                    value={filters.channel}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        channel: e.target.value,
                      }))
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {channelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Город</label>
                  <select
                    aria-label="Фильтр по городу"
                    value={filters.city}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {cityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button onClick={handleExport} disabled={!chartData}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт CSV
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Выручка",
            icon: DollarSign,
            value: metrics?.revenue ? formatCurrency(metrics.revenue) : "0 ₸",
            sub: "за выбранный период",
          },
          {
            title: "Заказы",
            icon: ShoppingCart,
            value: metrics?.orders ? formatNumber(metrics.orders) : "0",
            sub: "штук",
          },
          {
            title: "AOV",
            icon: TrendingUp,
            value: metrics?.aov ? formatCurrency(metrics.aov) : "0 ₸",
            sub: "средний чек",
          },
          {
            title: "Конверсия",
            icon: Target,
            value: metrics
              ? `${((metrics.conversionRate || 0) * 100).toFixed(1)}%`
              : "0%",
            sub: "конверсия в заказы",
          },
        ].map((card, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? "..." : card.value}
              </div>
              <p className="text-xs text-muted-foreground">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Аналитика по периодам</CardTitle>
          <CardDescription>
            Динамика выручки и заказов за выбранный период
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="line" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="line">Линейный график</TabsTrigger>
              <TabsTrigger value="bar">Столбчатый график</TabsTrigger>
            </TabsList>

            <TabsContent value="line" className="mt-6">
              <div className="h-[400px]">
                {chartLoading ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Загрузка графика...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "revenue"
                            ? formatCurrency(Number(value))
                            : formatNumber(Number(value)),
                          name === "revenue" ? "Выручка" : "Заказы",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bar" className="mt-6">
              <div className="h-[400px]">
                {chartLoading ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Загрузка графика...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "revenue"
                            ? formatCurrency(Number(value))
                            : formatNumber(Number(value)),
                          name === "revenue" ? "Выручка" : "Заказы",
                        ]}
                      />
                      <Bar dataKey="revenue" fill="#8884d8" name="revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
