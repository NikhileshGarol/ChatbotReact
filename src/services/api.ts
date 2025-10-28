import axios, { type AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
  },
  // withCredentials: true, // enable if your backend requires cookies
});
/**
 * Read persisted auth state from localStorage and map to headers.
 * We intentionally do not import AuthContext into this module to avoid
 * circular dependencies. AuthContext persists state into localStorage.
 */
function attachAuthHeaders(config: any) {
  try {
    const raw = localStorage.getItem("AUTH_STORAGE_V1");
    if (!raw) return config;

    const auth = JSON.parse(raw);

    // if (!auth || !auth.role) return config;

    if (auth.token || auth.access_token) {
      const token = auth.token || auth.access_token;
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    }

    // if (auth.role === "superadmin") {
    //   const { username, password } = auth.credentials || {};
    //   if (username) config.headers["x-username"] = username;
    //   if (password) config.headers["x-password"] = password;
    // } else if (auth.role === "admin" || auth.role === "user") {
    //   const { tenantCode, userCode, apiKey } = auth.credentials || {};
    //   if (tenantCode) config.headers["X-Tenant-Code"] = tenantCode;
    //   if (userCode) config.headers["X-User-Code"] = userCode;
    //   if (apiKey) config.headers["X-API-Key"] = apiKey;
    // }
  } catch (err) {
    // ignore parsing errors
  }
  return config;
}

api.interceptors.request.use(
  (config) => {
    config = attachAuthHeaders(config);
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Generic response interceptor: if 401 -> clear auth and redirect to login.
 * Customize behavior depending on backend 401 response shape.
 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("AUTH_STORAGE_V1");
      // navigate("/auth/login", { replace: true });
    }
    return Promise.reject(error);
  }
);

export default api;
