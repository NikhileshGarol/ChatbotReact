import axios from "axios";
import { api } from "./api";
import type { RequestResetPassword, ResetPassword } from "./types";
import { apiPublic } from "./apiPublic";

const API_URL = "http://127.0.0.1:8000";

export async function login(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  const resp = await axios.post(`${API_URL}/auth/login`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });
  return resp.data;
}

export async function refreshToken(refresh_token: string) {
  const response = await api.post(
    "/auth/refresh-token",
    {},
    { params: { refresh_token } }
  );

  return response.data;
}

export async function requestResetPassword(payload: RequestResetPassword) {
  const response = await api.post("/auth/request-password-reset", payload);
  return response.data;
}

export async function resetPassword(
  payload: ResetPassword,
  params?: { token: string }
) {
  const response = await apiPublic.post("/auth/reset-password", payload, {
    params: params, // Axios request config with params here
  });
  return response.data;
}
