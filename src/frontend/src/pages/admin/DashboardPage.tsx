import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useFRMS } from "@/context/FRMSContext";
import { AlertTriangle, BarChart3, FileSpreadsheet } from "lucide-react";

function StatCard({
  label,
  value,
  borderColor,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  borderColor: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className={`shadow-card border-l-4 ${borderColor}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
          >
            <Icon size={22} className={iconColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { requests } = useFRMS();

  const totalRequests = requests.length;
  const totalIssues = requests.filter((r) => r.status === "rejected").length;
  const totalRetrieved = requests.filter((r) => r.status === "approved").length;

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Overview of all form requests and system activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-5" data-ocid="dashboard.section">
        <StatCard
          label="Total Form Requests"
          value={totalRequests}
          borderColor="border-blue-500"
          icon={FileSpreadsheet}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Form Issues (Rejected)"
          value={totalIssues}
          borderColor="border-orange-500"
          icon={AlertTriangle}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          label="Forms Retrieved (Approved)"
          value={totalRetrieved}
          borderColor="border-green-500"
          icon={BarChart3}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          caffeine.ai
        </a>
      </div>
    </AdminLayout>
  );
}
