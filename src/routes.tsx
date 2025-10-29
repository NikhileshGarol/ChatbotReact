import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import Unauthorized from "./components/Unauthorized";
import { Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const CompanyList = lazy(() => import("./pages/admin/CompanyList"));
const UserList = lazy(() => import("./pages/admin/UserList"));
const UploadDocuments = lazy(() => import("./pages/training/UploadDocuments"));
const ProfilePage = lazy(() => import("./pages/myProfile/Profile"));
const TrainManager = lazy(() => import("./pages/training/TrainManager"));

const routes = [
  {
    path: "/auth/login",
    element: (
      <Suspense fallback={<Loader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/auth/forgot",
    element: (
      <Suspense fallback={<Loader />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["admin", "superadmin"]}>
          <Suspense fallback={<Loader />}>
            <AdminDashboard />
          </Suspense>
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["admin", "superadmin"]}>
          <Suspense fallback={<Loader />}>
            <CompanyList />
          </Suspense>
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["admin", "superadmin"]}>
          <Suspense fallback={<Loader />}>
            <UserList />
          </Suspense>
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/upload",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["superadmin", "admin", "user"]}>
          <Suspense fallback={<Loader />}>
            <UploadDocuments />
          </Suspense>
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
    {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["superadmin", "admin", "user"]}>
          <Suspense fallback={<Loader />}>
            <ProfilePage />
          </Suspense>
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/training",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["admin", "user"]}>
          <Suspense fallback={<Loader />}>
            <TrainManager />
          </Suspense>
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <Navigate to="/unauthorized" replace />,
  },
];

export default routes;
