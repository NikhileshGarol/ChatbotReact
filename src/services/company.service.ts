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

export async function createCompanyAdmin(
  tenantCode: string,
  payload: CompanyAdminCreatePayload
) {
  const resp = await api.post<UserOutWithApiKey>(
    `/superadmin/companies/${tenantCode}/admin`,
    payload
  );
  return resp.data;
}
