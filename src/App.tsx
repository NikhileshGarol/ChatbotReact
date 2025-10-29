import { Routes, Route } from "react-router-dom";
import routes from "./routes";
import FloatingChat from "./components/FloatingChat";
import { useAuth } from "./contexts/AuthContext";
import { useTokenRefreshWithInactivity } from "./hooks/useTokenRefreshWithInactivity";

export default function App() {
  const { isAuthenticated } = useAuth();
  useTokenRefreshWithInactivity();
  return (
    <>
      <Routes>
        {routes.map((r, idx) => (
          <Route key={idx} path={r.path} element={r.element} />
        ))}
        {/* <Route path="/" element={<Navigate to="/auth/login" replace />} /> */}
        {/* <Route
          path="*"
          element={<div style={{ padding: 32 }}>404 — Not Found</div>}
        /> */}
      </Routes>
      {isAuthenticated && <FloatingChat />}
    </>
  );
}
