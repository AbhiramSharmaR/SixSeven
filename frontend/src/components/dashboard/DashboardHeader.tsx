import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("pg_user") || '{"username":"User"}');
  const username = user.username || user.fullName || "User";

  return (
    // Dashboard header - sea green accent (adjust --pg-cyan in index.css to customize)
    <header className="flex items-center justify-between px-6 py-4 bg-pg-dark-card border-b border-border">
      <div className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className={`font-display text-sm font-semibold transition-colors ${
            location.pathname === "/dashboard" ? "text-primary" : "text-white/50 hover:text-white"
          }`}
        >
          Analyse
        </Link>
        <Link
          to="/results"
          className={`font-display text-sm font-semibold transition-colors ${
            location.pathname === "/results" ? "text-primary" : "text-white/50 hover:text-white"
          }`}
        >
          Results
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-display text-sm text-white">
          HI <span className="text-primary">{username.toUpperCase()}</span>!
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-border text-white/60 hover:text-primary hover:border-primary"
          onClick={() => navigate("/profile")}
        >
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
