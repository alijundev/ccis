"use client";

import { Bell, Search, User, HelpCircle, Sun, Moon } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title?: string;
  role?: "STUDENT" | "ADMIN";
  userName?: string;
  userMajor?: string;
  userNim?: string;
}

export default function Header({ 
  title = "Student Voice", 
  role = "STUDENT",
  userName,
  userMajor,
  userNim
}: HeaderProps) {
  const [search, setSearch] = useState("");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const root = document.documentElement;
    if (themeMode === "light") {
      root.classList.add("dark");
      setThemeMode("dark");
    } else {
      root.classList.remove("dark");
      setThemeMode("light");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card text-card-foreground flex justify-between items-center h-16 pl-14 pr-4 md:px-8 border-b border-border shadow-xs backdrop-blur-md bg-opacity-95">
      {/* Page Title or Search */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <h2 className="text-md md:text-lg font-bold text-primary tracking-tight hidden sm:block whitespace-nowrap shrink-0">
          {title}
        </h2>
        <div className="relative w-full max-w-xs md:max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <input
            type="text"
            placeholder="Cari keluhan, kategori, atau status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-muted/50 border border-border rounded-full text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
          />
        </div>
      </div>

      {/* Header Utilities */}
      <div className="flex items-center gap-4 md:gap-6 ml-4">
        {/* Help Circle & Theme Toggle */}
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle Tema"
          >
            {themeMode === "light" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </button>
          <button
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors hidden md:block"
            title="Bantuan"
          >
            <HelpCircle className="size-4" />
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer hover:bg-muted p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="size-4 text-primary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 border-l border-border pl-4 md:pl-6">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-foreground">
              {userName || (role === "ADMIN" ? "Admin Academic" : "Budi Santoso")}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {role === "ADMIN" 
                ? (userMajor || "Lembaga Penjamin Mutu") 
                : `${userNim || "2109876543"} • ${userMajor || "Informatika"}`}
            </p>
          </div>
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-border hover:bg-primary/20 transition-colors">
            {(userName || (role === "ADMIN" ? "Admin" : "Student")).substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
