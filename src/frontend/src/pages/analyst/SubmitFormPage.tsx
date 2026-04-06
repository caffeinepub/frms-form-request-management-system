import { AnalystLayout } from "@/components/layout/AnalystLayout";
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
import { Textarea } from "@/components/ui/textarea";
import { useFRMS } from "@/context/FRMSContext";
import { FileText, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FormData {
  projectName: string;
  purpose: string;
  formName: string;
  formId: string;
  copies: string;
  remarks: string;
}

const EMPTY: FormData = {
  projectName: "",
  purpose: "",
  formName: "",
  formId: "",
  copies: "",
  remarks: "",
};

export default function SubmitFormPage() {
  const { submitRequest } = useFRMS();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const set =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.projectName.trim()) errs.projectName = "Project name is required";
    if (!form.purpose.trim()) errs.purpose = "Purpose is required";
    if (!form.formName.trim()) errs.formName = "Form name is required";
    if (!form.formId.trim()) errs.formId = "Form ID is required";
    if (
      !form.copies.trim() ||
      Number.isNaN(Number(form.copies)) ||
      Number(form.copies) < 1
    )
      errs.copies = "Enter a valid number of copies (≥1)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    submitRequest({
      projectName: form.projectName.trim(),
      purpose: form.purpose.trim(),
      formName: form.formName.trim(),
      formId: form.formId.trim(),
      copies: Number(form.copies),
      remarks: form.remarks.trim(),
    });
    setForm(EMPTY);
    setErrors({});
    setSubmitting(false);
    toast.success("Form request submitted successfully!");
  };

  return (
    <AnalystLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "oklch(0.93 0.03 243)" }}
          >
            <FileText size={18} style={{ color: "oklch(0.28 0.09 243)" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Submit Form Request
            </h1>
            <p className="text-sm text-gray-500">
              Fill in the details to request a new form
            </p>
          </div>
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="projectName">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    value={form.projectName}
                    onChange={set("projectName")}
                    placeholder="e.g. Alpha ERP Migration"
                    data-ocid="submit.project_name.input"
                    className={errors.projectName ? "border-red-400" : ""}
                  />
                  {errors.projectName && (
                    <p
                      className="text-xs text-red-500"
                      data-ocid="submit.project_name_error"
                    >
                      {errors.projectName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="formName">
                    Form Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="formName"
                    value={form.formName}
                    onChange={set("formName")}
                    placeholder="e.g. ERP Data Migration Form"
                    data-ocid="submit.form_name.input"
                    className={errors.formName ? "border-red-400" : ""}
                  />
                  {errors.formName && (
                    <p
                      className="text-xs text-red-500"
                      data-ocid="submit.form_name_error"
                    >
                      {errors.formName}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="formId">
                    Form ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="formId"
                    value={form.formId}
                    onChange={set("formId")}
                    placeholder="e.g. ERP-2024-001"
                    data-ocid="submit.form_id.input"
                    className={errors.formId ? "border-red-400" : ""}
                  />
                  {errors.formId && (
                    <p
                      className="text-xs text-red-500"
                      data-ocid="submit.form_id_error"
                    >
                      {errors.formId}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="copies">
                    Number of Copies <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="copies"
                    type="number"
                    min="1"
                    value={form.copies}
                    onChange={set("copies")}
                    placeholder="e.g. 3"
                    data-ocid="submit.copies.input"
                    className={errors.copies ? "border-red-400" : ""}
                  />
                  {errors.copies && (
                    <p
                      className="text-xs text-red-500"
                      data-ocid="submit.copies_error"
                    >
                      {errors.copies}
                    </p>
                  )}
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <Label htmlFor="purpose">
                  Purpose <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  value={form.purpose}
                  onChange={set("purpose")}
                  placeholder="Describe the purpose of this form request..."
                  rows={3}
                  data-ocid="submit.purpose.textarea"
                  className={errors.purpose ? "border-red-400" : ""}
                />
                {errors.purpose && (
                  <p
                    className="text-xs text-red-500"
                    data-ocid="submit.purpose_error"
                  >
                    {errors.purpose}
                  </p>
                )}
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <Label htmlFor="remarks">Remarks (optional)</Label>
                <Textarea
                  id="remarks"
                  value={form.remarks}
                  onChange={set("remarks")}
                  placeholder="Any additional notes or special instructions..."
                  rows={2}
                  data-ocid="submit.remarks.textarea"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  data-ocid="submit.submit_button"
                  className="gap-2 font-semibold"
                  style={{ backgroundColor: "oklch(0.28 0.09 243)" }}
                >
                  <Send size={15} />
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AnalystLayout>
  );
}
