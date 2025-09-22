"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/ui/switch";
import { Label } from "@/ui/label";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="theme" className="flex items-center gap-2">
        {theme === "dark" ? (
          <>
            <Moon className="h-4 w-4" />
            Dark
          </>
        ) : (
          <>
            <Sun className="h-4 w-4" />
            Light
          </>
        )}
      </Label>
      <Switch
        id="theme"
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
}
