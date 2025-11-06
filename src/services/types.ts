// src/services/types.ts

export type CompanyCreatePayload = {
  name: string;
  tenant_code: string;
  slug_url?: string | null;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
};

export type CompanyOut = {
  id: number;
  name: string;
  tenant_code: string;
  slug_url: string;
  email: string;
  phone: string;
  address: string;
};

export type CompanyListOut = {
  items: [
    {
      id: number;
      name: "string";
      tenant_code: "string";
      slug_url: "string";
      widget_key: "string";
      email: "string";
      phone: "string";
      website: "string";
      address: "string";
      city: "string";
      state: "string";
      country: "string";
    }
  ];
  total: number;
  page: number;
  size: number;
  pages: number;
};

export type CompanyAdminCreatePayload = {
  tenant_code: string;
  display_name: string;
  user_code: string; // should start with tenant_code
  role: "admin";
  email: string;
  address: string;
  contact_number: string;
  password: string;
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
  email: string;
  address: string;
  contact_number: string;
  password: string;
};

export type UserOut = {
  id: number;
  display_name: string;
  user_code: string;
  role: string;
  api_key?: string;
  email: string;
  address: string;
  contact_number: string;
  profile_image: string;
};

export type UserListOut = {
  items: [
    {
      id: number;
      display_name: "string";
      user_code: "string";
      role: "string";
      api_key: "string";
      email: "string";
      firstname: "string";
      lastname: "string";
      contact_number: "string";
      profile_image: "string";
      company_name: "string";
      address: "string";
      city: "string";
      state: "string";
      country: "string";
      is_active: true;
    }
  ];
  total: number;
  page: number;
  size: number;
  pages: number;
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

export type DocumentListOut = {
  items: [
    {
      id: number;
      filename: "string";
      original_name: "string";
      filepath: "string";
      uploader_id: number;
      user_code: "string";
      user_name: "string";
      company_name: "string";
      num_chunks: number;
      status: "string";
      created_at: "string";
      error_message: "string";
    }
  ];
  total: number;
  page: number;
  size: number;
  pages: number;
};

export type SuperAdminDocumentListOut = {
  items: [
    {
      id: number;
      filename: "string";
      original_name: "string";
      filepath: "string";
      uploader_id: number;
      user_code: "string";
      user_name: "string";
      company_name: "string";
      num_chunks: number;
      status: "string";
      created_at: "string";
      error_message: "string";
    }
  ];
  total: number;
  page: number;
  size: number;
  pages: number;
};

export type WebsiteListOut = {
  items: [
    {
      id: number;
      url: "string";
      title: "string";
      uploader_id: number;
      user_code: "string";
      user_name: "string";
      company_name: "string";
      num_chunks: number;
      status: "string";
      created_at: "string";
      error_message: "string";
    }
  ];
  total: number;
  page: number;
  size: number;
  pages: number;
};

export type SuperAdminWebsiteListOut = {
  items: [
    {
      id: number;
      url: "string";
      title: "string";
      uploader_id: number;
      user_code: "string";
      user_name: "string";
      company_name: "string";
      num_chunks: number;
      status: "string";
      created_at: "string";
      error_message: "string";
    }
  ];
  total: number;
  page: number;
  size: number;
  pages: number;
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

export type WebsiteRequest = {
  urls: string[];
};

export type RequestResetPassword = {
  email: string;
};

export type ResetPassword = {
  new_password: string;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type UsersPageOptions = {
  include_inactive: boolean;
  page: number;
  size: number;
};

export type PageOptions = {
  page: number;
  size: number;
};

export type DocumentsPageOptions = {
  my_docs_only: string;
  page: number;
  size: number;
};

export type SuperAdminDocumentsPageOptions = {
  tenant_code: string | undefined;
  page: number;
  size: number;
};

export type Roles = "superadmin" | "admin" | "user";
