import LoginPage from "./pages/auth/LoginPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminDashboard from "./pages/admin/Dashboard";
import CompanyList from "./pages/admin/CompanyList";
import UserList from "./pages/admin/UserList";
import UploadDocuments from "./pages/training/UploadDocuments";
import TrainManager from "./pages/training/TrainManager";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import Unauthorized from "./components/Unauthorized";
import { Navigate } from "react-router-dom";

const routes = [
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/auth/forgot", element: <ForgotPassword /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["admin"]}>
          <AdminDashboard />
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["admin"]}>
          <CompanyList />
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["admin"]}>
          <UserList />
        </RoleGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/upload",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["admin", "user"]}>
          <UploadDocuments />
        </RoleGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/training",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={["admin", "user"]}>
          <TrainManager />
        </RoleGuard>
      </ProtectedRoute>
    ),
  },

  //   {
  //     path: "/chat",
  //     element: (
  //       <ProtectedRoute>
  //         <RoleGuard allowed={["admin", "user"]}>
  //           <ChatScreen />
  //         </RoleGuard>
  //       </ProtectedRoute>
  //     ),
  //   },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <Navigate to="/unauthorized" replace /> },
];

export default routes;
