import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";

const COLLAPSE_KEY = "admin-sidebar-collapsed";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      // localStorage unavailable (e.g. private browsing) — collapse state just won't persist.
    }
  }, [collapsed]);

  return (
    <div className="admin-shell min-h-screen bg-background">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1750px] px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
