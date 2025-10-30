import { api } from "./api";
import type { UserCreatePayload, UserOut } from "./types";

export async function createUser(payload: UserCreatePayload) {
  const resp = await api.post<any>("/users", payload);
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

export async function updateCurrentUser(payload: any) {
  const resp = await api.put("/users/me", payload);
  return resp.data;
}

export async function postUserImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const resp = await api.post<any>("/users/me/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return resp.data;
}

export async function getUserImage() {
  const resp = await api.get("/users/me/image", {
    responseType: "blob", // important to get raw binary Blob
  });
  return resp.data; // returns Blob
}

export async function deleteUserImage() {
  const resp = await api.delete("/users/me/image");
  return resp.data;
}

export async function getUserById(userId: number) {
  const resp = await api.get(`/users/${userId}`);
  return resp.data;
}

export async function updateUserById(userId: number, payload: any) {
  const resp = await api.put(`/users/${userId}`, payload);
  return resp.data;
}

export async function deleteUser(userId: number) {
  const resp = await api.delete(`/users/${userId}`);
  return resp.data;
}
