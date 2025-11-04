import { Routes, Route } from "react-router-dom";
import routes from "./routes";
import { useTokenRefreshWithInactivity } from "./hooks/useTokenRefreshWithInactivity";

export default function App() {
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
    </>
  );
}
