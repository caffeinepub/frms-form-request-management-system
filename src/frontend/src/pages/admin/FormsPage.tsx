import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { type AdminForm, useFRMS } from "@/context/FRMSContext";
import { format } from "date-fns";
import {
  AlertTriangle,
  Download,
  Edit2,
  Eye,
  FileText,
  Paperclip,
  Save,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ─── Add Form Tab ─────────────────────────────────────────────────────────────

type AddFormFields = {
  formName: string;
  formNumber: string;
  version: string;
  sopNumber: string;
  fileName: string;
  fileDataUrl: string;
};

const EMPTY_FORM: AddFormFields = {
  formName: "",
  formNumber: "",
  version: "",
  sopNumber: "",
  fileName: "",
  fileDataUrl: "",
};

function AddFormTab() {
  const { addAdminForm } = useFRMS();
  const [fields, setFields] = useState<AddFormFields>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleField = (key: keyof AddFormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFields((prev) => ({
        ...prev,
        fileName: file.name,
        fileDataUrl: ev.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fields.formName.trim() ||
      !fields.formNumber.trim() ||
      !fields.version.trim() ||
      !fields.sopNumber.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    addAdminForm({
      formName: fields.formName.trim(),
      formNumber: fields.formNumber.trim(),
      version: fields.version.trim(),
      sopNumber: fields.sopNumber.trim(),
      fileName: fields.fileName || undefined,
      fileDataUrl: fields.fileDataUrl || undefined,
    });
    toast.success("Form submitted to Analyst");
    setFields(EMPTY_FORM);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSubmitting(false);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-gray-800">
          Add New Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          {/* Form Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="addform-name"
              className="text-sm font-medium text-gray-700"
            >
              Form Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addform-name"
              placeholder="e.g. Employee Onboarding Form"
              value={fields.formName}
              onChange={(e) => handleField("formName", e.target.value)}
              data-ocid="forms.form_name.input"
              className="h-9 text-sm"
            />
          </div>

          {/* Form Number */}
          <div className="space-y-1.5">
            <Label
              htmlFor="addform-number"
              className="text-sm font-medium text-gray-700"
            >
              Form Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addform-number"
              placeholder="e.g. FRM-2024-001"
              value={fields.formNumber}
              onChange={(e) => handleField("formNumber", e.target.value)}
              data-ocid="forms.form_number.input"
              className="h-9 text-sm"
            />
          </div>

          {/* Version */}
          <div className="space-y-1.5">
            <Label
              htmlFor="addform-version"
              className="text-sm font-medium text-gray-700"
            >
              Version <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addform-version"
              placeholder="e.g. 1.0"
              value={fields.version}
              onChange={(e) => handleField("version", e.target.value)}
              data-ocid="forms.version.input"
              className="h-9 text-sm"
            />
          </div>

          {/* SOP Number */}
          <div className="space-y-1.5">
            <Label
              htmlFor="addform-sop"
              className="text-sm font-medium text-gray-700"
            >
              SOP Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addform-sop"
              placeholder="e.g. SOP-HR-2024-003"
              value={fields.sopNumber}
              onChange={(e) => handleField("sopNumber", e.target.value)}
              data-ocid="forms.sop_number.input"
              className="h-9 text-sm"
            />
          </div>

          {/* Upload Form */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Upload Form
            </Label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFile}
                className="hidden"
                id="addform-file"
                data-ocid="forms.upload_button"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="forms.upload_button"
                className="h-9 gap-2 text-sm"
              >
                <Paperclip size={14} />
                Upload
              </Button>
              {fields.fileName ? (
                <span className="text-sm text-gray-600 flex items-center gap-1.5">
                  <FileText size={13} className="text-blue-500" />
                  {fields.fileName}
                </span>
              ) : (
                <span className="text-sm text-gray-400">No file selected</span>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting}
              data-ocid="forms.submit.primary_button"
              className="h-9 px-6 text-sm font-medium"
              style={{ backgroundColor: "oklch(0.50 0.19 243)" }}
            >
              Submit to Analyst
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Deprecation Dialogs ───────────────────────────────────────────────────────

type DeprecateConfirmDialogProps = {
  open: boolean;
  formName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function DeprecateConfirmDialog({
  open,
  formName,
  onConfirm,
  onCancel,
}: DeprecateConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onCancel();
      }}
    >
      <DialogContent
        className="max-w-sm"
        data-ocid="forms.deprecate_confirm.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <AlertTriangle
              size={18}
              className="text-orange-500 flex-shrink-0"
            />
            Are you sure you want to deprecate the form?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mt-1">
          You are about to deprecate{" "}
          <span className="font-medium text-gray-800">{formName}</span>. This
          action cannot be undone.
        </p>
        <DialogFooter className="mt-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            data-ocid="forms.deprecate_confirm.cancel_button"
            className="h-8 text-sm"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            data-ocid="forms.deprecate_confirm.yes_button"
            className="h-8 text-sm bg-orange-600 hover:bg-orange-700 text-white"
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DeprecateRemarksDialogProps = {
  open: boolean;
  formName: string;
  onSubmit: (remarks: string) => void;
  onCancel: () => void;
};

function DeprecateRemarksDialog({
  open,
  formName,
  onSubmit,
  onCancel,
}: DeprecateRemarksDialogProps) {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!remarks.trim()) {
      setError(true);
      return;
    }
    onSubmit(remarks.trim());
    setRemarks("");
    setError(false);
  };

  const handleCancel = () => {
    setRemarks("");
    setError(false);
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleCancel();
      }}
    >
      <DialogContent
        className="max-w-sm"
        data-ocid="forms.deprecate_remarks.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900">
            Deprecation Remarks
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-1">
          <p className="text-sm text-gray-600">
            Please enter the reason for deprecating{" "}
            <span className="font-medium text-gray-800">{formName}</span>.
          </p>
          <div className="space-y-1">
            <Label
              htmlFor="deprecate-remarks"
              className="text-sm font-medium text-gray-700"
            >
              Remarks <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="deprecate-remarks"
              placeholder="Enter reason for deprecation..."
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                if (e.target.value.trim()) setError(false);
              }}
              data-ocid="forms.deprecate_remarks.input"
              className={`text-sm resize-none min-h-[90px] ${
                error ? "border-red-400 focus-visible:ring-red-300" : ""
              }`}
            />
            {error && (
              <p className="text-xs text-red-500">
                Remarks are required to proceed.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            data-ocid="forms.deprecate_remarks.cancel_button"
            className="h-8 text-sm"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            data-ocid="forms.deprecate_remarks.submit_button"
            className="h-8 text-sm bg-orange-600 hover:bg-orange-700 text-white"
          >
            Deprecate Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── View Form Modal ───────────────────────────────────────────────────────────

type ViewModalProps = {
  form: AdminForm | null;
  open: boolean;
  onClose: () => void;
};

function ViewFormModal({ form, open, onClose }: ViewModalProps) {
  const { updateAdminForm } = useFRMS();
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState<Partial<AdminForm>>({});
  const [newFile, setNewFile] = useState<{
    name: string;
    dataUrl: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      setEditMode(false);
      setEditFields({});
      setNewFile(null);
      onClose();
    }
  };

  const startEdit = () => {
    if (!form) return;
    setEditFields({
      formName: form.formName,
      formNumber: form.formNumber,
      version: form.version,
      sopNumber: form.sopNumber,
    });
    setNewFile(null);
    setEditMode(true);
  };

  const handleEditField = (key: keyof AdminForm, value: string) => {
    setEditFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setNewFile({ name: file.name, dataUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form) return;
    const updates: Partial<AdminForm> = { ...editFields };
    if (newFile) {
      updates.fileName = newFile.name;
      updates.fileDataUrl = newFile.dataUrl;
    }
    updateAdminForm(form.id, updates);
    toast.success("Form updated");
    setEditMode(false);
    setEditFields({});
    setNewFile(null);
  };

  if (!form) return null;

  const displayFileName = newFile?.name ?? form.fileName;
  const displayFileDataUrl = newFile?.dataUrl ?? form.fileDataUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg" data-ocid="forms.view.dialog">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-gray-900">
              {editMode ? "Edit Form" : "Form Details"}
            </DialogTitle>
            {!editMode && (
              <Button
                size="sm"
                variant="outline"
                onClick={startEdit}
                data-ocid="forms.view.edit_button"
                className="h-8 gap-1.5 text-xs mr-6"
              >
                <Edit2 size={13} />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {editMode ? (
            // Edit mode fields
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Form Name
                </Label>
                <Input
                  value={editFields.formName ?? ""}
                  onChange={(e) => handleEditField("formName", e.target.value)}
                  data-ocid="forms.edit.form_name.input"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Form Number
                </Label>
                <Input
                  value={editFields.formNumber ?? ""}
                  onChange={(e) =>
                    handleEditField("formNumber", e.target.value)
                  }
                  data-ocid="forms.edit.form_number.input"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Version
                </Label>
                <Input
                  value={editFields.version ?? ""}
                  onChange={(e) => handleEditField("version", e.target.value)}
                  data-ocid="forms.edit.version.input"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  SOP Number
                </Label>
                <Input
                  value={editFields.sopNumber ?? ""}
                  onChange={(e) => handleEditField("sopNumber", e.target.value)}
                  data-ocid="forms.edit.sop_number.input"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Replace File
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleEditFile}
                    className="hidden"
                    id="editform-file"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    data-ocid="forms.edit.upload_button"
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Paperclip size={12} />
                    Upload New File
                  </Button>
                  {(newFile?.name ?? form.fileName) ? (
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <FileText size={12} className="text-blue-500" />
                      {newFile?.name ?? form.fileName}
                      {newFile && (
                        <span className="text-green-600 font-medium">
                          (new)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">No file</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            // View mode fields
            <div className="grid gap-3">
              <DetailRow label="Form Name" value={form.formName} />
              <DetailRow label="Form Number" value={form.formNumber} />
              <DetailRow label="Version" value={form.version} />
              <DetailRow label="SOP Number" value={form.sopNumber} />
              <DetailRow
                label="Status"
                value={
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      form.status === "active"
                        ? "border-green-300 text-green-700 bg-green-50"
                        : "border-gray-300 text-gray-500 bg-gray-50"
                    }`}
                  >
                    {form.status === "active" ? "Active" : "Deprecated"}
                  </Badge>
                }
              />
              {form.status === "deprecated" && form.deprecationRemarks && (
                <DetailRow
                  label="Dep. Remarks"
                  value={
                    <span className="text-sm text-gray-700 italic">
                      {form.deprecationRemarks}
                    </span>
                  }
                />
              )}
              <DetailRow
                label="Created"
                value={format(new Date(form.createdAt), "MMM d, yyyy")}
              />
              {displayFileName && (
                <DetailRow
                  label="Attached File"
                  value={
                    displayFileDataUrl ? (
                      <a
                        href={displayFileDataUrl}
                        download={displayFileName}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        data-ocid="forms.view.download.button"
                      >
                        <Download size={13} />
                        {displayFileName}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <FileText size={13} className="text-gray-400" />
                        {displayFileName}
                      </span>
                    )
                  }
                />
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {editMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditMode(false);
                  setEditFields({});
                  setNewFile(null);
                }}
                data-ocid="forms.edit.cancel_button"
                className="h-8 text-sm"
              >
                <X size={13} className="mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                data-ocid="forms.edit.save_button"
                className="h-8 text-sm gap-1.5"
                style={{ backgroundColor: "oklch(0.50 0.19 243)" }}
              >
                <Save size={13} />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="forms.view.close_button"
              className="h-8 text-sm"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider w-28 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-800 flex-1">{value}</span>
    </div>
  );
}

// ─── Forms Table ───────────────────────────────────────────────────────────────

function FormsTable({
  forms,
  showDeprecateButton,
  onView,
  onDeprecateClick,
}: {
  forms: AdminForm[];
  showDeprecateButton: boolean;
  onView: (form: AdminForm) => void;
  onDeprecateClick: (form: AdminForm) => void;
}) {
  if (forms.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Form Name
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Form Number
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Version
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SOP Number
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Date Added
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-16">
              <FileText size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-400">No forms here yet.</p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 hover:bg-gray-50">
          <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Form Name
          </TableHead>
          <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Form Number
          </TableHead>
          <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Version
          </TableHead>
          <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            SOP Number
          </TableHead>
          <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Date Added
          </TableHead>
          <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map((form, idx) => (
          <TableRow
            key={form.id}
            className="hover:bg-blue-50/30 transition-colors"
            data-ocid={`forms.view_forms.item.${idx + 1}`}
          >
            <TableCell className="text-sm font-medium text-gray-800">
              {form.formName}
            </TableCell>
            <TableCell className="text-sm font-mono text-gray-600 text-xs">
              {form.formNumber}
            </TableCell>
            <TableCell className="text-sm text-gray-600">
              {form.version}
            </TableCell>
            <TableCell className="text-sm font-mono text-gray-600 text-xs">
              {form.sopNumber}
            </TableCell>
            <TableCell className="text-xs text-gray-500">
              {format(new Date(form.createdAt), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(form)}
                  data-ocid={`forms.view.button.${idx + 1}`}
                  className="h-7 px-2.5 text-xs gap-1 font-medium"
                >
                  <Eye size={12} />
                  View
                </Button>
                {showDeprecateButton && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeprecateClick(form)}
                    data-ocid={`forms.deprecated.button.${idx + 1}`}
                    className="h-7 px-2.5 text-xs gap-1 font-medium text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Deprecate
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── View Forms Tab ────────────────────────────────────────────────────────────

function ViewFormsTab() {
  const { adminForms, deprecateAdminForm } = useFRMS();
  const [selectedForm, setSelectedForm] = useState<AdminForm | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Deprecation flow state
  const [pendingDeprecateForm, setPendingDeprecateForm] =
    useState<AdminForm | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRemarksDialog, setShowRemarksDialog] = useState(false);

  const activeForms = adminForms.filter((f) => f.status === "active");
  const deprecatedForms = adminForms.filter((f) => f.status === "deprecated");

  const openView = (form: AdminForm) => {
    setSelectedForm(form);
    setModalOpen(true);
  };

  // Step 1: click Deprecate button -> show confirm dialog
  const handleDeprecateClick = (form: AdminForm) => {
    setPendingDeprecateForm(form);
    setShowConfirmDialog(true);
  };

  // Step 2: user clicks Yes in confirm dialog -> close confirm, open remarks
  const handleConfirmYes = () => {
    setShowConfirmDialog(false);
    setShowRemarksDialog(true);
  };

  // Cancel at confirm step
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    setPendingDeprecateForm(null);
  };

  // Step 3: user submits remarks -> deprecate the form
  const handleRemarksSubmit = (remarks: string) => {
    if (!pendingDeprecateForm) return;
    deprecateAdminForm(pendingDeprecateForm.id, remarks);
    toast.success(`"${pendingDeprecateForm.formName}" has been deprecated.`);
    setShowRemarksDialog(false);
    setPendingDeprecateForm(null);
  };

  // Cancel at remarks step
  const handleRemarksCancel = () => {
    setShowRemarksDialog(false);
    setPendingDeprecateForm(null);
  };

  return (
    <>
      <Tabs defaultValue="active" data-ocid="forms.view_forms.subtabs">
        <TabsList
          className="mb-4 h-8 bg-gray-100 p-1 rounded-md"
          data-ocid="forms.view_forms.subtabs.list"
        >
          <TabsTrigger
            value="active"
            data-ocid="forms.view_forms.active_tab"
            className="text-xs px-4 h-6"
          >
            Active Forms
            {activeForms.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full text-[10px] font-semibold px-1.5 min-w-[18px]">
                {activeForms.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="deprecated"
            data-ocid="forms.view_forms.deprecated_tab"
            className="text-xs px-4 h-6"
          >
            Deprecated Forms
            {deprecatedForms.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-[10px] font-semibold px-1.5 min-w-[18px]">
                {deprecatedForms.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <FormsTable
                  forms={activeForms}
                  showDeprecateButton={true}
                  onView={openView}
                  onDeprecateClick={handleDeprecateClick}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deprecated" className="mt-0">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <FormsTable
                  forms={deprecatedForms}
                  showDeprecateButton={false}
                  onView={openView}
                  onDeprecateClick={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View form modal */}
      <ViewFormModal
        form={selectedForm}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedForm(null);
        }}
      />

      {/* Step 1: Confirm deprecation */}
      <DeprecateConfirmDialog
        open={showConfirmDialog}
        formName={pendingDeprecateForm?.formName ?? ""}
        onConfirm={handleConfirmYes}
        onCancel={handleConfirmCancel}
      />

      {/* Step 2: Mandatory remarks */}
      <DeprecateRemarksDialog
        open={showRemarksDialog}
        formName={pendingDeprecateForm?.formName ?? ""}
        onSubmit={handleRemarksSubmit}
        onCancel={handleRemarksCancel}
      />
    </>
  );
}

// ─── Main FormsPage ────────────────────────────────────────────────────────────

export default function FormsPage() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage and distribute forms to Analysts
        </p>
      </div>

      <Tabs defaultValue="add-form" data-ocid="forms.tabs">
        <TabsList
          className="mb-5 h-9 bg-gray-100 p-1 rounded-lg"
          data-ocid="forms.tabs.tab"
        >
          <TabsTrigger
            value="add-form"
            data-ocid="forms.add_form.tab"
            className="text-sm px-4"
          >
            Add Form
          </TabsTrigger>
          <TabsTrigger
            value="view-forms"
            data-ocid="forms.view_forms.tab"
            className="text-sm px-4"
          >
            View Forms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-form" className="mt-0">
          <AddFormTab />
        </TabsContent>

        <TabsContent value="view-forms" className="mt-0">
          <ViewFormsTab />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
