import { useFRMS } from "@/context/FRMSContext";
import { Link, useLocation } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { ClipboardList, FileText, LayoutDashboard, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/requests", label: "All Requests", icon: ClipboardList },
  { to: "/admin/forms", label: "Forms", icon: FileText },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useFRMS();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col"
        style={{ backgroundColor: "oklch(0.22 0.07 250)" }}
      >
        {/* Logo */}
        <div
          className="px-6 py-5 border-b"
          style={{ borderColor: "oklch(0.28 0.06 250)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: "oklch(0.50 0.19 243)" }}
            >
              F
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-wide">
                FRMS
              </div>
              <div
                className="text-xs"
                style={{ color: "oklch(0.65 0.04 247)" }}
              >
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`admin.${label.toLowerCase().replace(" ", "_")}.link`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "hover:text-white"
                }`}
                style={{
                  backgroundColor: isActive
                    ? "oklch(0.32 0.08 248)"
                    : "transparent",
                  color: isActive ? "white" : "oklch(0.75 0.03 247)",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div
          className="px-3 py-4 border-t"
          style={{ borderColor: "oklch(0.28 0.06 250)" }}
        >
          <div className="px-3 mb-3">
            <div className="text-xs font-semibold text-white">
              {currentUser?.name}
            </div>
            <div className="text-xs" style={{ color: "oklch(0.55 0.03 247)" }}>
              {currentUser?.email}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="admin.logout.button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ color: "oklch(0.65 0.04 247)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "white";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "oklch(0.32 0.08 248)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.65 0.04 247)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
