import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type RequestStatus = "pending" | "approved" | "rejected" | "onHold";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "analyst" | "admin";
}

export interface FormRequest {
  id: string;
  projectName: string;
  purpose: string;
  formName: string;
  formId: string;
  copies: number;
  remarks: string;
  status: RequestStatus;
  adminComments?: string;
  pdfDataUrl?: string;
  pdfFileName?: string;
  formVersion?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  requestId: string;
  changedBy: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  comment?: string;
  timestamp: string;
}

export interface AdminForm {
  id: string;
  formName: string;
  formNumber: string;
  version: string;
  sopNumber: string;
  fileName?: string;
  fileDataUrl?: string;
  status: "active" | "deprecated";
  deprecationRemarks?: string;
  createdAt: string;
}

const DEMO_USERS: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@frms.com",
    password: "Admin123",
    role: "admin",
  },
  {
    id: "u2",
    name: "Alice Johnson",
    email: "analyst1@frms.com",
    password: "Analyst123",
    role: "analyst",
  },
  {
    id: "u3",
    name: "Bob Smith",
    email: "analyst2@frms.com",
    password: "Analyst123",
    role: "analyst",
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const SEED_REQUESTS: FormRequest[] = [
  {
    id: "REQ-001",
    projectName: "Alpha ERP Migration",
    purpose:
      "Compliance audit requires updated request forms for ERP data migration process.",
    formName: "ERP Data Migration Form",
    formId: "ERP-2024-001",
    copies: 3,
    remarks: "Urgent — needed before Q1 close",
    status: "approved",
    adminComments: "Reviewed and approved. Version 2.1 attached.",
    pdfDataUrl: undefined,
    pdfFileName: "ERP-Data-Migration-Form-v2.1.pdf",
    formVersion: "2.1",
    createdBy: "u2",
    createdByName: "Alice Johnson",
    createdAt: daysAgo(28),
  },
  {
    id: "REQ-002",
    projectName: "Beta Customer Portal",
    purpose:
      "Onboarding new enterprise clients requires standard intake form documentation.",
    formName: "Client Intake Form",
    formId: "CIF-2024-007",
    copies: 5,
    remarks: "Need both digital and print-ready formats",
    status: "pending",
    createdBy: "u3",
    createdByName: "Bob Smith",
    createdAt: daysAgo(21),
  },
  {
    id: "REQ-003",
    projectName: "Gamma Compliance Review",
    purpose: "Annual compliance review mandates updated risk assessment forms.",
    formName: "Risk Assessment Checklist",
    formId: "RAC-2024-003",
    copies: 2,
    remarks: "Must comply with ISO 27001 standards",
    status: "rejected",
    adminComments: "Form version outdated. Please resubmit with 2024 template.",
    createdBy: "u2",
    createdByName: "Alice Johnson",
    createdAt: daysAgo(18),
  },
  {
    id: "REQ-004",
    projectName: "Delta HR Transformation",
    purpose:
      "HR digitization project requires updated employee onboarding documentation.",
    formName: "Employee Onboarding Package",
    formId: "EOP-2024-012",
    copies: 10,
    remarks: "Needed for Q2 rollout across all departments",
    status: "onHold",
    adminComments: "Awaiting legal sign-off on clause 4.2.",
    createdBy: "u3",
    createdByName: "Bob Smith",
    createdAt: daysAgo(14),
  },
  {
    id: "REQ-005",
    projectName: "Epsilon Data Governance",
    purpose:
      "Data governance framework requires standardized consent and processing forms.",
    formName: "Data Processing Agreement",
    formId: "DPA-2024-005",
    copies: 4,
    remarks: "GDPR compliance mandatory",
    status: "approved",
    adminComments: "Approved. Ensure distribution to all data handlers.",
    pdfFileName: "Data-Processing-Agreement-v1.3.pdf",
    formVersion: "1.3",
    createdBy: "u2",
    createdByName: "Alice Johnson",
    createdAt: daysAgo(10),
  },
  {
    id: "REQ-006",
    projectName: "Zeta Cloud Infrastructure",
    purpose:
      "Cloud migration SOPs require updated access request and provisioning forms.",
    formName: "Cloud Access Request Form",
    formId: "CAR-2024-009",
    copies: 6,
    remarks: "AWS and Azure templates both needed",
    status: "pending",
    createdBy: "u3",
    createdByName: "Bob Smith",
    createdAt: daysAgo(6),
  },
  {
    id: "REQ-007",
    projectName: "Eta Security Audit",
    purpose:
      "Annual security audit requires incident reporting and escalation forms.",
    formName: "Security Incident Report",
    formId: "SIR-2024-002",
    copies: 8,
    remarks: "Confidential — restricted distribution",
    status: "pending",
    createdBy: "u2",
    createdByName: "Alice Johnson",
    createdAt: daysAgo(2),
  },
];

const SEED_AUDIT: AuditEntry[] = [
  {
    id: "a1",
    requestId: "REQ-001",
    changedBy: "Admin User",
    fromStatus: "pending",
    toStatus: "approved",
    comment: "Reviewed and approved. Version 2.1 attached.",
    timestamp: daysAgo(25),
  },
  {
    id: "a2",
    requestId: "REQ-003",
    changedBy: "Admin User",
    fromStatus: "pending",
    toStatus: "rejected",
    comment: "Form version outdated. Please resubmit with 2024 template.",
    timestamp: daysAgo(15),
  },
  {
    id: "a3",
    requestId: "REQ-004",
    changedBy: "Admin User",
    fromStatus: "pending",
    toStatus: "onHold",
    comment: "Awaiting legal sign-off on clause 4.2.",
    timestamp: daysAgo(12),
  },
  {
    id: "a4",
    requestId: "REQ-005",
    changedBy: "Admin User",
    fromStatus: "pending",
    toStatus: "approved",
    comment: "Approved. Ensure distribution to all data handlers.",
    timestamp: daysAgo(8),
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

interface FRMSContextValue {
  currentUser: User | null;
  requests: FormRequest[];
  auditLog: AuditEntry[];
  adminForms: AdminForm[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  submitRequest: (
    data: Omit<
      FormRequest,
      "id" | "status" | "createdBy" | "createdByName" | "createdAt"
    >,
  ) => void;
  updateRequestStatus: (
    requestId: string,
    newStatus: RequestStatus,
    comment?: string,
    pdfDataUrl?: string,
    pdfFileName?: string,
    formVersion?: string,
    formName?: string,
    formId?: string,
  ) => void;
  addAdminForm: (data: Omit<AdminForm, "id" | "createdAt" | "status">) => void;
  updateAdminForm: (id: string, updates: Partial<AdminForm>) => void;
  deprecateAdminForm: (id: string, remarks: string) => void;
}

const FRMSContext = createContext<FRMSContextValue | null>(null);

export function FRMSProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const uid = localStorage.getItem("frms_session");
    if (!uid) return null;
    return DEMO_USERS.find((u) => u.id === uid) ?? null;
  });

  const [requests, setRequests] = useState<FormRequest[]>(() =>
    loadFromStorage("frms_requests", SEED_REQUESTS),
  );

  const [auditLog, setAuditLog] = useState<AuditEntry[]>(() =>
    loadFromStorage("frms_audit", SEED_AUDIT),
  );

  const [adminForms, setAdminForms] = useState<AdminForm[]>(() =>
    loadFromStorage("frms_admin_forms", []),
  );

  useEffect(() => {
    saveToStorage("frms_requests", requests);
  }, [requests]);

  useEffect(() => {
    saveToStorage("frms_audit", auditLog);
  }, [auditLog]);

  useEffect(() => {
    saveToStorage("frms_admin_forms", adminForms);
  }, [adminForms]);

  const login = useCallback((email: string, password: string): boolean => {
    const user = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!user) return false;
    setCurrentUser(user);
    localStorage.setItem("frms_session", user.id);
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("frms_session");
  }, []);

  const submitRequest = useCallback(
    (
      data: Omit<
        FormRequest,
        "id" | "status" | "createdBy" | "createdByName" | "createdAt"
      >,
    ) => {
      if (!currentUser) return;
      const newReq: FormRequest = {
        ...data,
        id: `REQ-${String(Date.now()).slice(-6)}`,
        status: "pending",
        createdBy: currentUser.id,
        createdByName: currentUser.name,
        createdAt: new Date().toISOString(),
      };
      setRequests((prev) => [newReq, ...prev]);
    },
    [currentUser],
  );

  const updateRequestStatus = useCallback(
    (
      requestId: string,
      newStatus: RequestStatus,
      comment?: string,
      pdfDataUrl?: string,
      pdfFileName?: string,
      formVersion?: string,
      formName?: string,
      formId?: string,
    ) => {
      if (!currentUser) return;
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id !== requestId) return r;
          return {
            ...r,
            status: newStatus,
            adminComments: comment ?? r.adminComments,
            pdfDataUrl: pdfDataUrl ?? r.pdfDataUrl,
            pdfFileName: pdfFileName ?? r.pdfFileName,
            formVersion: formVersion ?? r.formVersion,
            formName: formName ?? r.formName,
            formId: formId ?? r.formId,
          };
        }),
      );
      const oldReq = requests.find((r) => r.id === requestId);
      if (!oldReq) return;
      const entry: AuditEntry = {
        id: `audit-${Date.now()}`,
        requestId,
        changedBy: currentUser.name,
        fromStatus: oldReq.status,
        toStatus: newStatus,
        comment,
        timestamp: new Date().toISOString(),
      };
      setAuditLog((prev) => [...prev, entry]);
    },
    [currentUser, requests],
  );

  const addAdminForm = useCallback(
    (data: Omit<AdminForm, "id" | "createdAt" | "status">) => {
      const newForm: AdminForm = {
        ...data,
        id: `FORM-${String(Date.now()).slice(-8)}`,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      setAdminForms((prev) => [newForm, ...prev]);
    },
    [],
  );

  const updateAdminForm = useCallback(
    (id: string, updates: Partial<AdminForm>) => {
      setAdminForms((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      );
    },
    [],
  );

  const deprecateAdminForm = useCallback((id: string, remarks: string) => {
    setAdminForms((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: "deprecated", deprecationRemarks: remarks }
          : f,
      ),
    );
  }, []);

  return (
    <FRMSContext.Provider
      value={{
        currentUser,
        requests,
        auditLog,
        adminForms,
        login,
        logout,
        submitRequest,
        updateRequestStatus,
        addAdminForm,
        updateAdminForm,
        deprecateAdminForm,
      }}
    >
      {children}
    </FRMSContext.Provider>
  );
}

export function useFRMS() {
  const ctx = useContext(FRMSContext);
  if (!ctx) throw new Error("useFRMS must be used within FRMSProvider");
  return ctx;
}
