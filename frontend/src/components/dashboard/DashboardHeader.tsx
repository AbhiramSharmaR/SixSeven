import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  let user: any = { username: "User" };
  try {
    const storedUser = localStorage.getItem("pg_user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Failed to parse user data:", error);
    // Fallback is already set
  }

  const username = user.username || user.fullName || "User";

  return (
    // Dashboard header - sea green accent (adjust --pg-cyan in index.css to customize)
    <header className="flex items-center justify-between px-6 py-4 bg-pg-dark-card border-b border-border">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src="/logo.ico.ico" alt="PharmaGuard Logo" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-display font-bold text-lg text-gradient-cyan hidden md:block">PharmaGuard</span>
        </Link>
        <div className="h-6 w-px bg-border mx-2 hidden md:block" />
        <Link
          to="/dashboard"
          className={`font-display text-sm font-semibold transition-colors ${location.pathname === "/dashboard" ? "text-primary" : "text-white/50 hover:text-white"
            }`}
        >
          Analyse
        </Link>
        <Link
          to="/results"
          className={`font-display text-sm font-semibold transition-colors ${location.pathname === "/results" ? "text-primary" : "text-white/50 hover:text-white"
            }`}
        >
          Results
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-display text-sm text-white">
          HI <span className="text-primary">{username.toUpperCase()}</span>!
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border text-white/60 hover:text-primary hover:border-primary"
            >
              <User className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              // Clear user data and redirect to login
              localStorage.removeItem("pg_user");
              // If you have other auth tokens/state, clear them here
              navigate("/login");
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
