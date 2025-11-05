// src/services/training.service.ts
import { api } from "./api";
import type {
  UploadResponse,
  DocumentOut,
  QueryRequest,
  QueryAnswer,
  WebsiteRequest,
} from "./types";

export async function uploadDocument(files: File[]) {
  const formData = new FormData();
    files.forEach((file) => {
    formData.append("files", file); // 'files' key should match backend expectation
  });
  const resp = await api.post<any>("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return resp.data as UploadResponse;
}

export async function listDocuments(params?: {my_docs_only: string}) {
  const resp = await api.get<DocumentOut[]>("/documents", { params });
  return resp.data;
}

export async function listDocumentsSuperadmin(params?: {
  tenant_code: string | undefined;
}) {
  const resp = await api.get<DocumentOut[]>("/documents/superadmin/all", {
    params,
  });
  return resp.data;
}

export async function deleteDocument(document_id: number) {
  const resp = await api.delete(`/documents/${document_id}`);
  return resp.data;
}

export async function queryPost(payload: QueryRequest) {
  const resp = await api.post<QueryAnswer>("/query", payload);
  return resp.data;
}

export async function uploadWebsite(payload: WebsiteRequest) {
  const resp = await api.post("/websites/scrape", payload);
  return resp.data;
}

export async function listWebsite(params?: { my_docs_only: string }) {
  const resp = await api.get("/websites", { params });
  return resp.data;
}

export async function listWebsitesSuperadmin(params?: {
  tenant_code: string | undefined;
}) {
  const resp = await api.get("/websites/superadmin/all", { params });
  return resp.data;
}

export async function deleteWebsite(id: number) {
  const resp = await api.delete(`/websites/${id}`);
  return resp.data;
}

export async function downloadDocSuperadmin(id: number) {
  const resp = await api.get(`/documents/superadmin/${id}/download`, {
    responseType: "blob",
  });
  return resp.data;
}

export async function downloadDocUser(id: number) {
  const resp = await api.get(`/documents/${id}/download`, {
    responseType: "blob",
  });
  return resp.data;
}
 
