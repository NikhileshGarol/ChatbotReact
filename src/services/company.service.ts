// src/services/company.service.ts
import { api } from "./api";
import type {
  CompanyAdminCreatePayload,
  CompanyCreatePayload,
  CompanyOut,
  UserOutWithApiKey,
} from "./types";

export async function createCompany(payload: CompanyCreatePayload) {
  const resp = await api.post<CompanyOut>("/superadmin/companies", payload);
  return resp.data;
}

export async function listCompanies() {
  const resp = await api.get<CompanyOut[]>("/superadmin/companies");
  return resp.data;
}

export async function updateCompanyDetails(
  tenantCode: string,
  payload: CompanyCreatePayload
) {
  const resp = await api.put<any>(
    `/superadmin/companies/${tenantCode}`,
    payload
  );
  return resp.data;
}

export async function deleteCompanyDetails(tenantCode: string) {
  const resp = await api.delete<any>(`/superadmin/companies/${tenantCode}`);
  return resp.data;
}

export async function createCompanyAdmin(
  tenantCode: string,
  payload: CompanyAdminCreatePayload
) {
  const resp = await api.post<any>(
    `/superadmin/companies/${tenantCode}/admin`,
    payload
  );
  return resp.data;
}

export async function getCompanyAdmins() {
  const resp = await api.get("/superadmin/companies/admins");
  return resp.data;
}

export async function getWidgetKey(tenantCode: string) {
  const resp = await api.get(`/widget/${tenantCode}/key`);
  return resp.data;
}

export async function regenerateWidgetKey(tenantCode: string) {
  const resp = await api.post(`/widget/${tenantCode}/regenerate`);
  return resp.data;
}

export async function queryCompanyData(
  tenantCode: string,
  question: string,
  topK: number = 5
) {
  const resp = await api.post(`/widget/superadmin/query/${tenantCode}`, {
    question,
    top_k: topK,
    user_filter: false,
  });
  return resp.data;
}
