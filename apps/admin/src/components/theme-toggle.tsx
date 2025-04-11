"use client";

import { Laptop, type LucideIcon, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeOption = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const themeOptions: ThemeOption[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Laptop },
  { id: "green", label: "Green", icon: Palette },
  { id: "blue", label: "Blue", icon: Palette },
  { id: "yellow", label: "Yellow", icon: Palette },
];

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const getCurrentThemeIcon = () => {
    const currentTheme = themeOptions.find((option) => option.id === theme);
    return currentTheme ? (
      <currentTheme.icon className="h-5 w-5" />
    ) : (
      <Palette className="h-5 w-5" />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {getCurrentThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-background">
        {themeOptions.map((option) => (
          <DropdownMenuItem key={option.id} onClick={() => setTheme(option.id)}>
            <option.icon className="mr-2 h-4 w-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
