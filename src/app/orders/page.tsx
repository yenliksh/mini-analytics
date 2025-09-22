"use client";

import { useState, useMemo } from "react";
import { useOrders, useCustomers } from "@/hooks/useData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { usePersistedState } from "@/hooks/usePersistedState";

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useOrders();
  const { data: customers = [] } = useCustomers();

  const [search, setSearch] = usePersistedState("ordersSearch", "");
  const [statusFilter, setStatusFilter] = usePersistedState(
    "ordersStatus",
    "all"
  );
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const customer = customers.find((c) => c.id === o.customerId);
      const matchesSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        customer?.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, customers, search, statusFilter]);

  const orderDetails = useMemo(() => {
    if (!selectedOrder) return null;
    const order = orders.find((o) => o.id === selectedOrder);
    const customer = customers.find((c) => c.id === order?.customerId);
    return order ? { ...order, customer } : null;
  }, [orders, customers, selectedOrder]);

  // 🟢 Загрузка
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  // 🔴 Ошибка
  if (isError) {
    return (
      <p className="text-red-500 text-sm">
        Ошибка загрузки заказов. Попробуйте обновить страницу.
      </p>
    );
  }

  return (
    <div>
      {/* 🔍 поиск и фильтры */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <Input
          aria-label="Поиск заказа"
          placeholder="Поиск по Order ID или имени клиента..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" aria-label="Фильтр по статусу">
              {statusFilter === "all" ? "Все статусы" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              Все статусы
            </DropdownMenuItem>
            {["New", "Processing", "Shipped"].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 📊 таблица */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Order ID</TableHead>
              <TableHead scope="col" className="hidden sm:table-cell">
                Date
              </TableHead>
              <TableHead scope="col">Customer</TableHead>
              <TableHead scope="col" className="hidden md:table-cell">
                City
              </TableHead>
              <TableHead scope="col" className="hidden lg:table-cell">
                Channel
              </TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const customer = customers.find((c) => c.id === order.customerId);
              return (
                <TableRow
                  key={order.id}
                  role="row"
                  tabIndex={0}
                  className="cursor-pointer hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{customer?.name ?? "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.city}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {order.channel}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          {order.status}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {["New", "Processing", "Shipped"].map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onClick={(e) => {
                              e.stopPropagation(); // чтобы не открывался диалог
                              console.log(`Изменён статус ${order.id}: ${s}`);
                              // тут можно добавить react-query mutation для обновления
                            }}
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 📝 Диалог деталей заказа */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Детали заказа</DialogTitle>
          </DialogHeader>
          {orderDetails ? (
            <div className="space-y-2">
              <p>
                <strong>Order ID:</strong> {orderDetails.id}
              </p>
              <p>
                <strong>Дата:</strong>{" "}
                {new Date(orderDetails.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Клиент:</strong> {orderDetails.customer?.name} (
                {orderDetails.customer?.email})
              </p>
              <p>
                <strong>Город:</strong> {orderDetails.city}
              </p>
              <p>
                <strong>Канал:</strong> {orderDetails.channel}
              </p>
              <p>
                <strong>Статус:</strong> {orderDetails.status}
              </p>
              <p>
                <strong>Сумма:</strong> ${orderDetails.total.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Здесь можно вывести состав заказа (позиции из JSON, если они
                есть).
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Данные заказа не найдены.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
