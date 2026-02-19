import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/services/api";

export default function Onboarding() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [hospital, setHospital] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = localStorage.getItem("pg_signup_email");
      const password = localStorage.getItem("pg_signup_password");

      if (!email || !password) {
        alert("Signup session expired. Please start over.");
        navigate("/signup");
        return;
      }

      const response = await auth.signup({
        email,
        password,
        username,
        fullName,
        hospital,
        gender
      });

      // Cleanup temp data
      localStorage.removeItem("pg_signup_email");
      localStorage.removeItem("pg_signup_password");

      // Store token and user
      localStorage.setItem("pg_token", response.data.access_token);
      localStorage.setItem("pg_user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup failed", error);
      alert(error.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pg-dark">
      <div className="w-full max-w-md p-8 rounded-xl bg-pg-dark-card border border-border">
        <h2 className="font-display text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
        <p className="text-white/40 text-sm mb-8">Tell us a bit about yourself</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-white/70 text-sm">Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required
              className="mt-1 bg-pg-dark border-border text-white placeholder:text-white/30" placeholder="dr_smith" />
          </div>
          <div>
            <Label className="text-white/70 text-sm">Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required
              className="mt-1 bg-pg-dark border-border text-white placeholder:text-white/30" placeholder="Dr. Jane Smith" />
          </div>
          <div>
            <Label className="text-white/70 text-sm">Hospital / Institution</Label>
            <Input value={hospital} onChange={(e) => setHospital(e.target.value)} required
              className="mt-1 bg-pg-dark border-border text-white placeholder:text-white/30" placeholder="City General Hospital" />
          </div>
          <div>
            <Label className="text-white/70 text-sm">Certification (Upload)</Label>
            <Input type="file" className="mt-1 bg-pg-dark border-border text-white/60 file:bg-primary file:text-primary-foreground file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:font-display file:text-xs" />
          </div>
          <div>
            <Label className="text-white/70 text-sm">Gender (Optional)</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="mt-1 bg-pg-dark border-border text-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-pg-dark-card border-border">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-pg-cyan-glow font-display">
            {loading ? "Completing Setup..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  );
}
