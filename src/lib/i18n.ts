export type Locale = "en" | "ru";

export const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    orders: "Orders",
    customers: "Customers",
    theme: "Theme",
    language: "Language",
  },
  ru: {
    dashboard: "Дашборд",
    orders: "Заказы",
    customers: "Клиенты",
    theme: "Тема",
    language: "Язык",
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
