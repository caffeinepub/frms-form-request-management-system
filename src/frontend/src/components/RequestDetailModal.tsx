import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  type FormRequest,
  type RequestStatus,
  useFRMS,
} from "@/context/FRMSContext";
import { format } from "date-fns";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  PauseCircle,
  Printer,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  request: FormRequest | null;
  open: boolean;
  onClose: () => void;
}

type ActionMode = null | "approve" | "reject" | "hold";

function AuditTimeline({ requestId }: { requestId: string }) {
  const { auditLog } = useFRMS();
  const entries = auditLog
    .filter((e) => e.requestId === requestId)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No status changes recorded yet.
      </p>
    );
  }

  const iconMap: Record<RequestStatus, React.ReactNode> = {
    pending: <Clock size={14} className="text-yellow-600" />,
    approved: <CheckCircle2 size={14} className="text-green-600" />,
    rejected: <XCircle size={14} className="text-red-600" />,
    onHold: <PauseCircle size={14} className="text-blue-600" />,
  };

  return (
    <div className="space-y-3">
      {entries.map((entry, idx) => (
        <div key={entry.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              {iconMap[entry.toStatus]}
            </div>
            {idx < entries.length - 1 && (
              <div className="w-px flex-1 bg-gray-200 my-1" />
            )}
          </div>
          <div className="pb-3 flex-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium text-gray-700">
                {entry.changedBy}
              </span>
              <ChevronRight size={10} />
              <StatusBadge status={entry.toStatus} />
              <span className="ml-auto">
                {format(new Date(entry.timestamp), "MMM d, yyyy HH:mm")}
              </span>
            </div>
            {entry.comment && (
              <p className="text-xs text-gray-500 mt-1 bg-gray-50 rounded p-2">
                {entry.comment}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function handlePrint(request: FormRequest) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast.error("Unable to open print window. Please allow popups.");
    return;
  }
  const statusLabel: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    onHold: "On Hold",
  };
  // Use the project ID (formId) and version as submitted/stored on the request
  const projectId = request.formId;
  const version = request.formVersion ?? "—";

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>FRMS Request - ${request.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          .subtitle { color: #555; font-size: 13px; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
          td:first-child { font-weight: 600; color: #374151; width: 160px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
          .status { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .status-approved { background: #d1fae5; color: #065f46; }
          .footer { margin-top: 40px; font-size: 11px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <h1>Form Request: ${request.id}</h1>
        <div class="subtitle">Printed on ${format(new Date(), "MMM d, yyyy HH:mm")}</div>
        <table>
          <tr><td>Status</td><td><span class="status status-approved">${statusLabel[request.status] ?? request.status}</span></td></tr>
          <tr><td>Project Name</td><td>${request.projectName}</td></tr>
          <tr><td>Project ID</td><td>${projectId}</td></tr>
          <tr><td>Purpose</td><td>${request.purpose}</td></tr>
          <tr><td>Form Name</td><td>${request.formName}</td></tr>
          <tr><td>Version</td><td>${version}</td></tr>
          <tr><td>Copies</td><td>${request.copies}</td></tr>
          <tr><td>Analyst</td><td>${request.createdByName}</td></tr>
          <tr><td>Submitted</td><td>${format(new Date(request.createdAt), "MMM d, yyyy HH:mm")}</td></tr>
          ${request.adminComments ? `<tr><td>Admin Notes</td><td>${request.adminComments}</td></tr>` : ""}
          ${request.remarks ? `<tr><td>Remarks</td><td>${request.remarks}</td></tr>` : ""}
        </table>
        <div class="footer">FRMS - Form Request Management System</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function RequestDetailModal({ request, open, onClose }: Props) {
  const { updateRequestStatus } = useFRMS();
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [comment, setComment] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [approvalFormName, setApprovalFormName] = useState("");
  const [approvalFormId, setApprovalFormId] = useState("");
  const [approvalFormVersion, setApprovalFormVersion] = useState("");

  if (!request) return null;

  // A request is locked (cannot be changed) if it is approved or rejected
  const isLocked =
    request.status === "approved" || request.status === "rejected";

  const isApproved = request.status === "approved";

  const resetActionState = () => {
    setActionMode(null);
    setComment("");
    setPdfFile(null);
    setApprovalFormName("");
    setApprovalFormId("");
    setApprovalFormVersion("");
  };

  const handleClose = () => {
    resetActionState();
    onClose();
  };

  const handleAction = async () => {
    if (actionMode === "approve") {
      if (!approvalFormVersion) {
        toast.error("Please enter a form version.");
        return;
      }
      let pdfDataUrl: string | undefined;
      let pdfFileName: string | undefined;
      if (pdfFile) {
        pdfDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(pdfFile);
        });
        pdfFileName = pdfFile.name;
      }
      updateRequestStatus(
        request.id,
        "approved",
        comment || undefined,
        pdfDataUrl,
        pdfFileName,
        approvalFormVersion,
        approvalFormName || undefined,
        approvalFormId || undefined,
      );
      toast.success(`Request ${request.id} approved successfully.`);
    } else if (actionMode === "reject") {
      updateRequestStatus(request.id, "rejected", comment || undefined);
      toast.success(`Request ${request.id} rejected.`);
    } else if (actionMode === "hold") {
      updateRequestStatus(request.id, "onHold", comment || undefined);
      toast.success(`Request ${request.id} put on hold.`);
    }
    resetActionState();
    onClose();
  };

  const DetailRow = ({
    label,
    value,
  }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-2 py-2">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider col-span-1">
        {label}
      </dt>
      <dd className="text-sm text-gray-800 col-span-2">{value}</dd>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="request_detail.modal"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Request {request.id}</span>
            <StatusBadge status={request.status} />
          </DialogTitle>
        </DialogHeader>

        {/* Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <dl className="divide-y divide-gray-100">
            <DetailRow label="Project" value={request.projectName} />
            <DetailRow label="Purpose" value={request.purpose} />
            <DetailRow label="Form Name" value={request.formName} />
            <DetailRow label="Project ID" value={request.formId} />
            <DetailRow label="Copies" value={request.copies} />
            <DetailRow label="Analyst" value={request.createdByName} />
            <DetailRow
              label="Submitted"
              value={format(new Date(request.createdAt), "MMM d, yyyy HH:mm")}
            />
            {request.formVersion && (
              <DetailRow label="Version" value={request.formVersion} />
            )}
            {request.adminComments && (
              <DetailRow label="Admin Notes" value={request.adminComments} />
            )}
            {request.remarks && (
              <DetailRow label="Remarks" value={request.remarks} />
            )}
          </dl>
        </div>

        {/* Audit Log */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Audit History
          </h4>
          <AuditTimeline requestId={request.id} />
        </div>

        <Separator />

        {/* Action Buttons — only show if not locked */}
        {!actionMode && !isLocked && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Actions
            </h4>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={() => setActionMode("approve")}
                data-ocid="request_detail.approve.button"
                className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
              >
                <CheckCircle2 size={14} /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActionMode("reject")}
                data-ocid="request_detail.reject.button"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-1.5"
              >
                <XCircle size={14} /> Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActionMode("hold")}
                data-ocid="request_detail.hold.button"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 gap-1.5"
              >
                <PauseCircle size={14} /> Hold
              </Button>
            </div>
          </div>
        )}

        {/* Locked notice for approved/rejected */}
        {isLocked && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            This request has been{" "}
            <strong>
              {request.status === "approved" ? "approved" : "rejected"}
            </strong>{" "}
            and cannot be changed.
          </div>
        )}

        {/* Hold state — show change options since hold is reversible */}
        {!actionMode && !isLocked && request.status === "onHold" && (
          <p className="text-xs text-gray-400 -mt-2">
            This request is on hold. You can approve, reject, or update the
            hold.
          </p>
        )}

        {/* Approve Form */}
        {actionMode === "approve" && (
          <div className="space-y-4 bg-green-50 border border-green-100 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-800">
              Approve Request
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="a-form-name" className="text-xs">
                  Form Name (override)
                </Label>
                <Input
                  id="a-form-name"
                  placeholder={request.formName}
                  value={approvalFormName}
                  onChange={(e) => setApprovalFormName(e.target.value)}
                  data-ocid="request_detail.form_name.input"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-form-id" className="text-xs">
                  Form ID (override)
                </Label>
                <Input
                  id="a-form-id"
                  placeholder={request.formId}
                  value={approvalFormId}
                  onChange={(e) => setApprovalFormId(e.target.value)}
                  data-ocid="request_detail.form_id.input"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-version" className="text-xs">
                  Form Version *
                </Label>
                <Input
                  id="a-version"
                  placeholder="e.g. 2.1"
                  value={approvalFormVersion}
                  onChange={(e) => setApprovalFormVersion(e.target.value)}
                  data-ocid="request_detail.form_version.input"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-pdf" className="text-xs">
                  Upload PDF
                </Label>
                <Input
                  id="a-pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                  data-ocid="request_detail.upload_button"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-comment" className="text-xs">
                Comment (optional)
              </Label>
              <Textarea
                id="a-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add an approval note..."
                data-ocid="request_detail.comment.textarea"
                rows={2}
                className="text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAction}
                data-ocid="request_detail.confirm.button"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetActionState}
                data-ocid="request_detail.cancel.button"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Reject Form */}
        {actionMode === "reject" && (
          <div className="space-y-4 bg-red-50 border border-red-100 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-red-800">
              Reject Request
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="r-comment" className="text-xs">
                Reason for rejection
              </Label>
              <Textarea
                id="r-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain why this request is being rejected..."
                data-ocid="request_detail.reject_comment.textarea"
                rows={3}
                className="text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAction}
                data-ocid="request_detail.confirm_reject.button"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Reject
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetActionState}
                data-ocid="request_detail.cancel_reject.button"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Hold Form */}
        {actionMode === "hold" && (
          <div className="space-y-4 bg-orange-50 border border-orange-100 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-orange-800">
              Put Request On Hold
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="h-comment" className="text-xs">
                Reason for hold
              </Label>
              <Textarea
                id="h-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain why this request is being held..."
                data-ocid="request_detail.hold_comment.textarea"
                rows={3}
                className="text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAction}
                data-ocid="request_detail.confirm_hold.button"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Confirm Hold
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetActionState}
                data-ocid="request_detail.cancel_hold.button"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between gap-2">
          {/* Print only available for Approved forms */}
          {isApproved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePrint(request)}
              data-ocid="request_detail.print.button"
              className="gap-1.5 text-gray-600"
            >
              <Printer size={14} /> Print
            </Button>
          )}
          {/* Spacer when Print is hidden so Close stays right-aligned */}
          {!isApproved && <span />}
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            data-ocid="request_detail.close.button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
