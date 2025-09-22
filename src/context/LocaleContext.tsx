"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "en" | "ru";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    orders: "Orders",
    customers: "Customers",
    dark: "Dark",
    settings: "Settings",
  },
  ru: {
    dashboard: "Дашборд",
    orders: "Заказы",
    customers: "Клиенты",
    dark: "Тёмная",
    settings: "Настройки",
  },
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  // load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored) setLocale(stored);
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t = (key: string) => translations[locale][key] ?? key;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
};
