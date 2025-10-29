import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export const GuestRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const role = user?.role;
      if (role === "superadmin") navigate("/admin");
      else if (role === "admin") navigate("/admin");
      else if (role === "user") navigate("/upload"); // Or appropriate landing page
    }
  }, [isAuthenticated, user, navigate]);

  return children;
};
