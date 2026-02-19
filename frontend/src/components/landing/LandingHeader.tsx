import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-pg-dark/80 backdrop-blur-md border-b border-border">
      <Link to="/" className="flex items-center gap-3">
        {/* Logo placeholder */}
        {/* Logo */}
        <img src="/logo.ico.ico" alt="PharmaGuard Logo" className="w-9 h-9 rounded-lg object-contain" />
        <span className="font-display font-bold text-lg text-gradient-cyan">PharmaGuard</span>
      </Link>

      <nav className="flex items-center gap-4">
        <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
          About Us
        </a>
        <Link to="/signup">
          <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10">
            Sign Up
          </Button>
        </Link>
        <Link to="/login">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Login
          </Button>
        </Link>
      </nav>
    </header>
  );
}
