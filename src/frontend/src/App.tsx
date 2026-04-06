import { Toaster } from "@/components/ui/sonner";
import { FRMSProvider, useFRMS } from "@/context/FRMSContext";
import LoginPage from "@/pages/LoginPage";
import AllRequestsPage from "@/pages/admin/AllRequestsPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import FormsPage from "@/pages/admin/FormsPage";
import MyRequestsPage from "@/pages/analyst/MyRequestsPage";
import SubmitFormPage from "@/pages/analyst/SubmitFormPage";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  ),
});

// Index route (redirect to login)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/login" />,
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Analyst route guard component
function AnalystGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useFRMS();
  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.role !== "analyst") return <Navigate to="/admin/dashboard" />;
  return <>{children}</>;
}

// Admin route guard component
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useFRMS();
  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.role !== "admin") return <Navigate to="/analyst/submit" />;
  return <>{children}</>;
}

// Analyst routes
const analystSubmitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analyst/submit",
  component: () => (
    <AnalystGuard>
      <SubmitFormPage />
    </AnalystGuard>
  ),
});

const analystRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analyst/requests",
  component: () => (
    <AnalystGuard>
      <MyRequestsPage />
    </AnalystGuard>
  ),
});

// Admin routes
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: () => (
    <AdminGuard>
      <DashboardPage />
    </AdminGuard>
  ),
});

const adminAllRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/requests",
  component: () => (
    <AdminGuard>
      <AllRequestsPage />
    </AdminGuard>
  ),
});

const adminFormsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/forms",
  component: () => (
    <AdminGuard>
      <FormsPage />
    </AdminGuard>
  ),
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  analystSubmitRoute,
  analystRequestsRoute,
  adminDashboardRoute,
  adminAllRequestsRoute,
  adminFormsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <FRMSProvider>
      <AppContent />
    </FRMSProvider>
  );
}
