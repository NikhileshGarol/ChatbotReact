// src/services/types.ts

export type CompanyCreatePayload = {
  name: string;
  tenant_code: string;
  slug_url?: string | null;
};

export type CompanyOut = {
  id: number;
  name: string;
  tenant_code: string;
  slug_url: string;
};

export type CompanyAdminCreatePayload = {
  tenant_code: string;
  display_name: string;
  user_code: string; // should start with tenant_code
  role: "admin";
};

export type UserOutWithApiKey = {
  id: number;
  display_name: string;
  user_code: string;
  role: string;
  api_key: string;
};

export type UserCreatePayload = {
  tenant_code: string;
  display_name: string;
  user_code: string;
  role: "admin" | "user";
  email: string,
  address: string,
  contact_number: string,
  password: string,
};

export type UserOut = {
  id: number;
  display_name: string;
  user_code: string;
  role: string;
  api_key?: string;
};

export type UploadResponse = {
  id: number;
  filename: string;
  tenant_code: string;
  created_at: string;
};

export type DocumentOut = {
  id: number;
  filename: string;
  created_at: string;
  status?: string;
  original_name: string;
  uploader_id: number;
  num_chunks: number;
  error_message: string | null;
};

export type QueryRequest = {
  question: string;
  top_k?: number;
  user_filter: false | boolean;
};

export type QueryAnswer = {
  answer: string;
  sources?: any[];
};

export type Roles = "superadmin" | "admin" | "user";
