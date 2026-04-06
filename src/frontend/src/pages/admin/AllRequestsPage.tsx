import { RequestDetailModal } from "@/components/RequestDetailModal";
import { StatusBadge } from "@/components/StatusBadge";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { type FormRequest, useFRMS } from "@/context/FRMSContext";
import { format } from "date-fns";
import { Download, FileSpreadsheet, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function exportToCsv(rows: FormRequest[]) {
  const headers = [
    "Request ID",
    "Analyst Name",
    "Project Name",
    "Form Name",
    "Form ID",
    "Copies",
    "Status",
    "Version",
    "Date",
  ];
  const csvEscape = (v: string | number) =>
    `"${String(v).replace(/"/g, '""')}"`;
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [
        csvEscape(r.id),
        csvEscape(r.createdByName),
        csvEscape(r.projectName),
        csvEscape(r.formName),
        csvEscape(r.formId),
        csvEscape(r.copies),
        csvEscape(r.status),
        csvEscape(r.formVersion ?? ""),
        escape(format(new Date(r.createdAt), "yyyy-MM-dd")),
      ].join(","),
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `frms-all-requests-${format(new Date(), "yyyyMMdd")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  toast.success("CSV exported successfully");
}

export default function AllRequestsPage() {
  const { requests } = useFRMS();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<FormRequest | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...requests];
    if (statusFilter !== "all")
      list = list.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.createdByName.toLowerCase().includes(q) ||
          r.projectName.toLowerCase().includes(q) ||
          r.formName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [requests, statusFilter, search]);

  const openDetail = (req: FormRequest) => {
    setSelectedRequest(req);
    setModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {filtered.length} of {requests.length} requests
        </p>
      </div>

      <Card className="shadow-card">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search by analyst, project, form, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="allrequests.search.search_input"
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-36 h-9 text-sm"
              data-ocid="allrequests.status.select"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="onHold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCsv(filtered)}
            data-ocid="allrequests.export.button"
            className="h-9 gap-1.5 text-sm"
          >
            <Download size={14} /> Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Request ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Analyst
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Project
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
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-16"
                    data-ocid="allrequests.requests.empty_state"
                  >
                    <FileSpreadsheet
                      size={32}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p className="text-sm text-gray-400">
                      No requests match the current filters
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((req, idx) => (
                  <TableRow
                    key={req.id}
                    className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                    onClick={() => openDetail(req)}
                    data-ocid={`allrequests.requests.item.${idx + 1}`}
                  >
                    <TableCell className="font-mono text-xs font-medium text-gray-700">
                      {req.id}
                    </TableCell>
                    <TableCell className="text-sm text-gray-800">
                      {req.createdByName}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 max-w-36">
                      <span className="truncate block">{req.projectName}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 max-w-36">
                      <span className="truncate block">{req.formName}</span>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-gray-600 text-xs">
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
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(req);
                        }}
                        data-ocid={`allrequests.actions.button.${idx + 1}`}
                        className="h-7 px-3 text-xs font-medium"
                      >
                        Actions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {requests.length} requests
          </div>
        )}
      </Card>

      <RequestDetailModal
        request={selectedRequest}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRequest(null);
        }}
      />
    </AdminLayout>
  );
}
