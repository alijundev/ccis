"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { 
  LayoutDashboard, 
  MessageSquarePlus, 
  History, 
  Settings, 
  LogOut, 
  BookOpen, 
  Activity,
  Sparkles,
  User,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/authActions";

interface SidebarProps {
  role?: "STUDENT" | "ADMIN";
  userName?: string;
  userMajor?: string;
}

export default function Sidebar({ role = "STUDENT", userName, userMajor }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  // Student Navigation items
  const studentNavItems = [
    {
      name: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Kirim Keluhan",
      href: "/student/complaints/new",
      icon: MessageSquarePlus,
    },
    {
      name: "Riwayat Saya",
      href: "/student/complaints",
      icon: History,
    },
  ];

  // Admin Navigation items
  const adminNavItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Daftar Keluhan",
      href: "/admin/complaints",
      icon: History,
    },
    {
      name: "Tentang Sistem",
      href: "/admin/about-system",
      icon: BookOpen,
    },
  ];

  const navItems = role === "ADMIN" ? adminNavItems : studentNavItems;

  const handleLogout = async () => {
    closeMobile();
    await logoutAction();
    router.push("/login");
  };

  const sidebarContent = (
    <>
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div className="px-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground text-primary rounded-lg flex items-center justify-center font-bold shadow-inner">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">CampusVoice</h1>
            <p className="text-xs text-primary-foreground/60 mt-1">Sistem Pengaduan Digital</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-98",
                  isActive
                    ? "bg-primary-foreground text-primary font-semibold shadow-xs"
                    : "text-primary-foreground/75 hover:text-primary-foreground hover:bg-white/10"
                )}
              >
                <Icon className={cn("size-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-primary-foreground/10 pt-4 flex flex-col gap-1">
        <Link
          href="/settings"
          onClick={closeMobile}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-98",
            pathname === "/settings"
              ? "bg-primary-foreground text-primary font-semibold"
              : "text-primary-foreground/75 hover:text-primary-foreground hover:bg-white/10"
          )}
        >
          <Settings className="size-5" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-foreground/75 hover:text-primary-foreground hover:bg-destructive/20 hover:text-destructive-foreground transition-all duration-200 text-left active:scale-98 w-full"
        >
          <LogOut className="size-5" />
          Logout
        </button>

        {/* User Badge */}
        <div className="mt-4 pt-4 border-t border-primary-foreground/5 flex items-center gap-3 px-2">
          <div className="size-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-semibold uppercase">
            {(userName || (role === "ADMIN" ? "Admin" : "Student")).substring(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-none truncate">
              {userName || (role === "ADMIN" ? "Admin Academic" : "Budi Santoso")}
            </p>
            <p className="text-[10px] text-primary-foreground/50 truncate mt-0.5">
              {role === "ADMIN" ? "Lembaga Penjamin Mutu" : (userMajor || "Informatika")}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card text-foreground border border-border shadow-sm hover:bg-muted active:scale-95 transition-all duration-150"
        aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
      >
        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-[260px] bg-primary text-primary-foreground flex flex-col justify-between py-6 px-4 shadow-md",
          "transition-transform duration-300 ease-in-out",
          // Mobile: slide in/out
          "z-50 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button inside mobile drawer for easy access */}
        <div className="absolute top-4 right-3">
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 transition-colors"
            aria-label="Tutup menu"
          >
            <X className="size-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar — always visible */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-[260px] bg-primary text-primary-foreground flex-col justify-between py-6 px-4 z-50 shadow-md">
        {sidebarContent}
      </aside>
    </>
  );
}
