import { Button } from "@/components/ui/button";
import { useFRMS } from "@/context/FRMSContext";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { FileText, ListOrdered, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { to: "/analyst/submit", label: "Submit Form", icon: FileText },
  { to: "/analyst/requests", label: "My Requests", icon: ListOrdered },
];

export function AnalystLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useFRMS();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 shadow-xs sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: "oklch(0.28 0.09 243)" }}
              >
                F
              </div>
              <span
                className="font-bold text-sm tracking-wide"
                style={{ color: "oklch(0.22 0.07 250)" }}
              >
                FRMS
              </span>
            </div>

            {/* Nav links */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    data-ocid={`analyst.${label.toLowerCase().replace(" ", "_")}.link`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              {currentUser?.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-ocid="analyst.logout.button"
              className="gap-1.5 text-gray-600"
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
