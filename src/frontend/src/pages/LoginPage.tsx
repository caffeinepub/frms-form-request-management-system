import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFRMS } from "@/context/FRMSContext";
import { useNavigate } from "@tanstack/react-router";
import { ShieldCheck, User2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type LoginRole = "analyst" | "admin";

const DEMO_CREDS: Record<LoginRole, { email: string; password: string }> = {
  analyst: { email: "analyst1@frms.com", password: "Analyst123" },
  admin: { email: "admin@frms.com", password: "Admin123" },
};

export default function LoginPage() {
  const { login } = useFRMS();
  const navigate = useNavigate();
  const [role, setRole] = useState<LoginRole>("analyst");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFillDemo = () => {
    setEmail(DEMO_CREDS[role].email);
    setPassword(DEMO_CREDS[role].password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = login(email, password);
    setLoading(false);
    if (!success) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    const user = email.toLowerCase().includes("admin") ? "admin" : role;
    if (user === "admin") {
      navigate({ to: "/admin/dashboard" });
    } else {
      navigate({ to: "/analyst/submit" });
    }
    toast.success("Welcome back!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "oklch(0.965 0.004 247)" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-card"
            style={{ backgroundColor: "oklch(0.28 0.09 243)" }}
          >
            F
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "oklch(0.22 0.07 250)" }}
          >
            Form Request Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <Card className="shadow-card border border-gray-200">
          <CardHeader className="pb-4">
            {/* Role Selector */}
            <div className="flex rounded-lg p-1 bg-gray-100">
              <button
                type="button"
                onClick={() => {
                  setRole("analyst");
                  setError("");
                }}
                data-ocid="login.analyst.tab"
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  role === "analyst"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <User2 size={14} /> Analyst Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setError("");
                }}
                data-ocid="login.admin.tab"
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  role === "admin"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ShieldCheck size={14} /> Admin Login
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="login.email.input"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-ocid="login.password.input"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p
                  className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2"
                  data-ocid="login.error_state"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={loading}
                data-ocid="login.submit_button"
                style={{ backgroundColor: "oklch(0.28 0.09 243)" }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs font-semibold text-blue-700 mb-1">
                Demo credentials
              </p>
              <div className="text-xs text-blue-600 space-y-0.5">
                <p>📧 {DEMO_CREDS[role].email}</p>
                <p>🔑 {DEMO_CREDS[role].password}</p>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                data-ocid="login.demo_fill.button"
                className="mt-2 text-xs text-blue-700 underline hover:text-blue-900"
              >
                Click to auto-fill
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
