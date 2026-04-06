import { StatusBadge } from "@/components/StatusBadge";
import { AnalystLayout } from "@/components/layout/AnalystLayout";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type FormRequest,
  type RequestStatus,
  useFRMS,
} from "@/context/FRMSContext";
import { format } from "date-fns";
import { FileX, ListOrdered } from "lucide-react";
import { useMemo, useState } from "react";

export default function MyRequestsPage() {
  const { currentUser, requests } = useFRMS();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const myRequests = useMemo(() => {
    let list = requests.filter((r) => r.createdBy === currentUser?.id);
    if (statusFilter !== "all")
      list = list.filter((r) => r.status === statusFilter);
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [requests, currentUser, statusFilter]);

  return (
    <AnalystLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.93 0.03 243)" }}
            >
              <ListOrdered
                size={18}
                style={{ color: "oklch(0.28 0.09 243)" }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Requests</h1>
              <p className="text-sm text-gray-500">
                {myRequests.length} request{myRequests.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-ocid="requests.status.select">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="onHold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Request ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Project Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Form Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Form ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Copies
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Version
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myRequests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-16"
                    data-ocid="requests.empty_state"
                  >
                    <FileX size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-400">No requests found</p>
                  </TableCell>
                </TableRow>
              ) : (
                myRequests.map((req, idx) => (
                  <TableRow
                    key={req.id}
                    className="hover:bg-blue-50/40 transition-colors"
                    data-ocid={`requests.item.${idx + 1}`}
                  >
                    <TableCell className="font-mono text-xs font-medium text-gray-700">
                      {req.id}
                    </TableCell>
                    <TableCell className="text-sm text-gray-800 max-w-40">
                      <span className="truncate block">{req.projectName}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-800 max-w-40">
                      <span className="truncate block">{req.formName}</span>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-gray-600">
                      {req.formId}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 text-center">
                      {req.copies}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {req.formVersion ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {format(new Date(req.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AnalystLayout>
  );
}
