import axios from "axios";
import { refreshToken } from "./auth.service";

const API_BASE = "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

function showSessionExpiredPopup() {
  localStorage.removeItem("AUTH_STORAGE_V1");
  window.dispatchEvent(new Event("session-expired"));
}

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("AUTH_STORAGE_V1");
  const auth = raw ? JSON.parse(raw) : null;
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const raw = localStorage.getItem("AUTH_STORAGE_V1");
        const auth = raw ? JSON.parse(raw) : null;
        if (!auth?.refreshToken) {
          showSessionExpiredPopup();
          return Promise.reject(error);
        }

        // Call refresh token endpoint — define refreshToken yourself
        const refreshed = await refreshToken(auth.refreshToken); // your refresh call here

        localStorage.setItem(
          "AUTH_STORAGE_V1",
          JSON.stringify({
            ...auth,
            token: refreshed.access_token,
            refreshToken: refreshed.refresh_token,
          })
        );

        originalRequest.headers.Authorization = `Bearer ${refreshed.access_token}`;
        return api(originalRequest);
      } catch (err) {
        showSessionExpiredPopup();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
