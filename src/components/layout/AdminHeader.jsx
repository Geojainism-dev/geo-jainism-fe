import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Menu, ChevronDown, UserCircle, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";
import { logoutUser } from "@/features/auth/localAuthApi";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminHeader({ onMenuClick }) {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const initial = user?.email?.[0]?.toUpperCase();

  const handleLogout = async () => {
    try {
      await logoutUser();
      await refresh();
      navigate("/admin/login", { replace: true });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 outline-none hover:bg-accent"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {initial}
            </span>
            <span className="hidden text-sm font-medium text-foreground sm:block">{user?.email}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <p className="text-sm font-medium text-foreground">{user?.email}</p>
            <Badge variant="secondary" className="mt-1 font-normal">
              {user?.role}
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/admin/profile" className="flex cursor-pointer items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="flex cursor-pointer items-center gap-2 text-destructive">
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
