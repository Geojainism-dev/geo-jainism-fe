import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  PartyPopper,
  ClipboardList,
  Newspaper,
  Tag,
  FolderOpen,
  UserCog,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, name: "Dashboard", path: "/admin/dashboard" },
      { icon: CalendarDays, name: "Calendar", path: "/admin/calendar" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: PartyPopper, name: "Events", path: "/admin/events" },
      { icon: ClipboardList, name: "Registrations", path: "/admin/registrations" },
      { icon: Newspaper, name: "Blog posts", path: "/admin/blog" },
      { icon: FolderOpen, name: "Categories", path: "/admin/blog/categories" },
      { icon: Tag, name: "Tags", path: "/admin/blog/tags" },
    ],
  },
];

const SUPER_ADMIN_GROUP = {
  label: "Access control",
  items: [
    { icon: ShieldCheck, name: "Pending requests", path: "/admin/users/pending" },
    { icon: UserCog, name: "Admins", path: "/admin/users" },
  ],
};

export default function AdminSidebar({ mobileOpen, onClose, collapsed, onToggleCollapse }) {
  const { user } = useAuth();
  const location = useLocation();
  const groups = user?.role === "SUPER_ADMIN" ? [...NAV_GROUPS, SUPER_ADMIN_GROUP] : NAV_GROUPS;

  // Pick the longest matching path so a sub-route (e.g. /admin/events/new)
  // highlights its parent, without also lighting up a sibling like Categories.
  const allPaths = groups.flatMap((g) => g.items.map((i) => i.path));
  const activePath = allPaths
    .filter((p) => location.pathname === p || location.pathname.startsWith(`${p}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <TooltipProvider delayDuration={200}>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[1px] lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-foreground/10 bg-sidebar text-sidebar-foreground shadow-xl transition-[width,transform] duration-200 ease-out lg:w-64 lg:translate-x-0 lg:shadow-none",
          collapsed && "lg:w-[76px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[72px] hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary lg:flex"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        <div
          className={cn(
            "flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-foreground/10",
            collapsed ? "justify-center px-2" : "px-5"
          )}
        >
          <img src="/logo.png" alt="GEO Jainism" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-background/60" />
          {!collapsed && (
            <span className="flex-1 text-base font-semibold tracking-tight text-sidebar-foreground">GEO Jainism</span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground lg:hidden"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6">
          {groups.map((group, groupIndex) => (
            <div key={group.label} className={cn(groupIndex > 0 && "mt-8")}>
              {collapsed ? (
                groupIndex > 0 && <div className="mx-2 mb-3 h-px bg-sidebar-foreground/10" />
              ) : (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
                  {group.label}
                </p>
              )}
              <ul className={cn("flex flex-col gap-1", !collapsed && "mt-2.5")}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.path === activePath;
                  const iconEl = (
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        active ? "bg-primary/15 text-primary" : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground/80"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                  );
                  return (
                    <li key={item.path}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              to={item.path}
                              onClick={onClose}
                              className={cn(
                                "group flex items-center justify-center rounded-lg py-1.5 transition-colors",
                                active ? "bg-primary/10" : "hover:bg-sidebar-foreground/8"
                              )}
                            >
                              {iconEl}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">{item.name}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={onClose}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-lg py-1.5 pl-1.5 pr-3 text-sm transition-colors",
                            active
                              ? "font-medium text-primary"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-foreground/8 hover:text-sidebar-foreground"
                          )}
                        >
                          {active && (
                            <span className="absolute -left-3 top-1/2 h-[18px] w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                          )}
                          {iconEl}
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
