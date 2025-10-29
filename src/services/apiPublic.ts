// src/services/apiPublic.ts
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const apiPublic = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});
