"use client";

import { useState, useMemo, useEffect } from "react";
import { useCustomers, useOrders } from "@/hooks/useData";
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

export default function CustomersPage() {
  const { data: customers = [], isLoading, isError } = useCustomers();
  const { data: orders = [] } = useOrders();

  const [search, setSearch] = usePersistedState("customersSearch", "");
  const [cityFilter, setCityFilter] = usePersistedState("customersCity", "all");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const uniqueCities = useMemo(
    () => Array.from(new Set(customers.map((c) => c.city))),
    [customers]
  );

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchesCity = cityFilter === "all" || c.city === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [customers, search, cityFilter]);

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders
      .filter((o) => o.customerId === selectedCustomer)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, selectedCustomer]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-sm">
        Ошибка загрузки клиентов. Попробуйте обновить страницу.
      </p>
    );
  }

  return (
    <div>
      {/* 🔍 поиск и фильтры */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <Input
          aria-label="Поиск клиента"
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" aria-label="Фильтр по городу">
              {cityFilter === "all" ? "Все города" : cityFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCityFilter("all")}>
              Все города
            </DropdownMenuItem>
            {uniqueCities.map((city) => (
              <DropdownMenuItem key={city} onClick={() => setCityFilter(city)}>
                {city}
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
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col" className="hidden sm:table-cell">
                Email
              </TableHead>
              <TableHead scope="col" className="hidden md:table-cell">
                City
              </TableHead>
              <TableHead scope="col" className="hidden lg:table-cell">
                LTV
              </TableHead>
              <TableHead scope="col">Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow
                key={customer.id}
                role="row"
                tabIndex={0}
                className="cursor-pointer hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setSelectedCustomer(customer.id)}
              >
                <TableCell>{customer.name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {customer.email}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {customer.city}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  ${customer.ltv.toFixed(2)}
                </TableCell>
                <TableCell>{customer.ordersCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 📝 Диалог заказов клиента */}
      <Dialog
        open={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>История заказов</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {customerOrders.length > 0 ? (
              customerOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-2 border rounded-md flex justify-between"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                    <p>
                      {order.channel} — {order.city}
                    </p>
                  </div>
                  <div className="font-semibold">${order.total.toFixed(2)}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                У клиента пока нет заказов.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
