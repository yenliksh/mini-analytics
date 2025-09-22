"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from "@/ui/sidebar";
import { Toaster } from "@/ui/sonner";
import Link from "next/link";
import { BarChart3, ShoppingCart, Users } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();

  const items = [
    { title: t("dashboard"), url: "/", icon: BarChart3 },
    { title: t("orders"), url: "/orders", icon: ShoppingCart },
    { title: t("customers"), url: "/customers", icon: Users },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="p-4 md:block hidden">
          <h2 className="text-lg font-semibold">Mini Analytics</h2>
        </div>

        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium 
             hover:bg-gray-100 dark:hover:bg-gray-800 
             text-gray-800 dark:text-gray-100 
             transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t px-4 py-4 space-y-4">
          <ThemeSwitcher />
        </div>
      </Sidebar>

      <div className="flex flex-col h-screen">
        <header
          className="h-16 border-b bg-white dark:bg-gray-950 
                           border-gray-200 dark:border-gray-700 
                           flex items-center justify-between px-4 z-40 relative"
        >
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mini Analytics
            </h1>
          </div>

          <LanguageSwitcher />
        </header>

        <SidebarInset>{children}</SidebarInset>
      </div>

      <Toaster />
    </SidebarProvider>
  );
}
