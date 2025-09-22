"use client";

import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {locale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setLocale("en")}>EN</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("ru")}>RU</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
