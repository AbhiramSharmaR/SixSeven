import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DnaCanvas from "@/components/landing/DnaCanvas";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Go to onboarding step 2
    localStorage.setItem("pg_signup_email", email);
    localStorage.setItem("pg_signup_password", password);
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block relative w-3/4">
        <DnaCanvas />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="font-display text-5xl font-bold text-white glow-text-cyan mb-4">PharmaGuard</h1>
            <p className="text-white/60 text-lg">Join the Precision Medicine Revolution</p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/4 min-w-[320px] flex items-center justify-center bg-pg-dark p-8">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-bold text-white mb-8">Sign Up</h2>
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
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-pg-cyan-glow font-display">
              Continue
            </Button>
          </form>
          <p className="text-white/40 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
