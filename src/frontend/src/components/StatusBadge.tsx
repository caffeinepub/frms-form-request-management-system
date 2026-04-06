import type { RequestStatus } from "@/context/FRMSContext";

const CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-800 border border-green-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border border-red-200",
  },
  onHold: {
    label: "On Hold",
    className: "bg-blue-100 text-blue-800 border border-blue-200",
  },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const { label, className } = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}
