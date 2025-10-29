import axios from "axios";
import { refreshToken } from "./auth.service";
import { isTokenExpired } from "../utils/token.utils";

const API_BASE = 'http://127.0.0.1:8000';
export const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

let isRefreshing = false;
let failedQueue: any[] = [];

function showSessionExpiredPopup() {
  localStorage.removeItem("AUTH_STORAGE_V1");
  window.dispatchEvent(new Event("session-expired"));
  // window.location.href = "/auth/login";
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ Request Interceptor
// api.interceptors.request.use((config) => {
//   const raw = localStorage.getItem("AUTH_STORAGE_V1");
//   if (raw) {
//     const auth = JSON.parse(raw);
//     if (auth.token) {
//       config.headers.Authorization = `Bearer ${auth.token}`;
//     }
//   }
//   return config;
// });

api.interceptors.request.use(async (config) => {
  const auth = JSON.parse(localStorage.getItem("AUTH_STORAGE_V1") || "{}");
  const token = auth?.token;
  const refreshToken = auth?.refreshToken;

  if (token) {
    // If token is expired, try refresh
    if (isTokenExpired(token)) {
      if (refreshToken) {
        try {
          const newToken = await refreshToken(refreshToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch {
          showSessionExpiredPopup();
          throw new Error("Session expired");
        }
      } else {
        showSessionExpiredPopup();
        throw new Error("No refresh token");
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ✅ Response Interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const status = error?.response?.status;

//     if (status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = "Bearer " + token;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       isRefreshing = true;

//       try {
//         const raw = localStorage.getItem("AUTH_STORAGE_V1");
//         const auth = raw ? JSON.parse(raw) : null;

//         if (!auth?.refreshToken) throw new Error("No refresh token");

//         const refreshed = await refreshToken(auth.refreshToken);

//         // Store new tokens
//         localStorage.setItem(
//           "AUTH_STORAGE_V1",
//           JSON.stringify({
//             ...auth,
//             token: refreshed.access_token,
//             refreshToken: refreshed.refresh_token,
//           })
//         );

//         processQueue(null, refreshed.access_token);
//         isRefreshing = false;

//         // Retry original request
//         originalRequest.headers["Authorization"] =
//           "Bearer " + refreshed.access_token;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         isRefreshing = false;
//         localStorage.removeItem("AUTH_STORAGE_V1");
//         window.location.href = "/auth/login";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response, // ✅ Pass successful responses as-is
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // If token expired (401) and we have a refresh token, attempt to refresh once
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const auth = JSON.parse(
          localStorage.getItem("AUTH_STORAGE_V1") || "{}"
        );
        const refreshToken = auth?.refreshToken;

        if (!refreshToken) {
          showSessionExpiredPopup();
          return Promise.reject(error);
        }

        // 🔁 Try refreshing access token
        const newAccessToken = await refreshToken(refreshToken);

        // ✅ Update header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // ❌ If refresh fails, show popup and redirect
        showSessionExpiredPopup();
        return Promise.reject(err);
      }
    }

    // Any other error — just reject
    return Promise.reject(error);
  }
);

// import axios, { type AxiosInstance } from "axios";

// const API_BASE = "http://127.0.0.1:8000";

// export const api: AxiosInstance = axios.create({
//   baseURL: API_BASE,
//   headers: {
//     Accept: "application/json",
//   },
// });
// /**
//  * Read persisted auth state from localStorage and map to headers.
//  * We intentionally do not import AuthContext into this module to avoid
//  * circular dependencies. AuthContext persists state into localStorage.
//  */
// function attachAuthHeaders(config: any) {
//   try {
//     const raw = localStorage.getItem("AUTH_STORAGE_V1");
//     if (!raw) return config;

//     const auth = JSON.parse(raw);

//     // if (!auth || !auth.role) return config;

//     if (auth.token || auth.access_token) {
//       const token = auth.token || auth.access_token;
//       config.headers["Authorization"] = `Bearer ${token}`;
//       return config;
//     }
//   } catch (err) {
//     // ignore parsing errors
//   }
//   return config;
// }

// api.interceptors.request.use(
//   (config) => {
//     config = attachAuthHeaders(config);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /**
//  * Generic response interceptor: if 401 -> clear auth and redirect to login.
//  * Customize behavior depending on backend 401 response shape.
//  */
// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     const status = error?.response?.status;
//     if (status === 401) {
//       // localStorage.removeItem("AUTH_STORAGE_V1");
//       // navigate("/auth/login", { replace: true });
//       console.warn("Unauthorized — session expired.");
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
