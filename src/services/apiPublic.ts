// src/services/apiPublic.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;;

export const apiPublic = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});
