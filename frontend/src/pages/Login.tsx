import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DnaCanvas from "@/components/landing/DnaCanvas";
import { auth } from "@/services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await auth.login({ email, password });

      // Store token and user details
      localStorage.setItem("pg_token", response.data.access_token);
      localStorage.setItem("pg_user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed", error);
      alert(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left 3/4 - DNA Background */}
      <div className="hidden md:block relative w-3/4">
        <DnaCanvas />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <img src="/logo.ico.ico" alt="PharmaGuard Logo" className="w-20 h-20 mx-auto mb-6 rounded-xl object-contain" />
            <h1 className="font-display text-5xl font-bold text-white glow-text-cyan mb-4">PharmaGuard</h1>
            <p className="text-white/60 text-lg">Precision Medicine, Powered by AI</p>
          </div>
        </div>
      </div>

      {/* Right 1/4 - Login Form */}
      <div className="w-full md:w-1/4 min-w-[320px] flex items-center justify-center bg-pg-dark p-8">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-bold text-white mb-8">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-white/70 text-sm">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-pg-dark-card border-border text-white placeholder:text-white/30"
                placeholder="you@hospital.com"
              />
            </div>
            <div>
              <Label className="text-white/70 text-sm">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-pg-dark-card border-border text-white placeholder:text-white/30"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-pg-cyan-glow font-display">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="text-white/40 text-sm mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
