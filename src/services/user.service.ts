// src/services/user.service.ts
import { api } from "./api";
import type { UserCreatePayload, UserOut } from "./types";

export async function createUser(payload: UserCreatePayload) {
  const resp = await api.post<UserOut>("/users", payload);
  return resp.data;
}

export async function listUsers() {
  const resp = await api.get<UserOut[]>("/users");
  return resp.data;
}

export async function getCurrentUser() {
  const resp = await api.get<UserOut>("/users/me");
  return resp.data;
}

// export async function deleteUser(userId: number) {
//   const resp = await api.delete(`/users/${userId}`);
//   return resp.data;
// }
