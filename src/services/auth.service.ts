import axios from "axios";
import api from "./api";

// export async function loginAsSuperadmin(
//   auth_type: "bearer" | "basic",
//   credentials: { username?: string; password?: string }
// ) {
//   const resp = await api.post("/auth/superadmin/login", credentials, {
//     params: { auth_type },
//   });
//   return resp.data;
// }
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

// // services/authService.ts
// import axios from "axios";

// export const authService = {
//   async loginAsUser(tenantCode: string, userCode: string, apiKey: string) {
//     const response = await axios.post(`${API_URL}/auth/login`, {
//       tenant_code: tenantCode,
//       user_code: userCode,
//       api_key: apiKey,
//     });

//     const { user, tenant } = response.data;

//     // Store auth info
//     localStorage.setItem(
//       "auth",
//       JSON.stringify({
//         tenantCode,
//         userCode,
//         apiKey,
//         user,
//         tenant,
//       })
//     );

//     return response.data;
//   },

//   async loginAsSuperadmin(
//     authType: "bearer" | "basic",
//     credentials: { token?: string; username?: string; password?: string }
//   ) {
//     if (authType === "bearer") {
//       const response = await axios.post(
//         `${API_URL}/auth/superadmin/login`,
//         {
//           token: credentials.token,
//         },
//         {
//           params: { auth_type: "bearer" },
//         }
//       );

//       localStorage.setItem(
//         "superadmin_auth",
//         JSON.stringify({
//           type: "bearer",
//           token: credentials.token,
//         })
//       );

//       return response.data;
//     } else {
//       // For basic auth, we'll set the Authorization header
//       const basicAuth = btoa(`${credentials.username}:${credentials.password}`);
//       const response = await axios.post(
//         `${API_URL}/auth/superadmin/login`,
//         {},
//         {
//           params: { auth_type: "basic" },
//           headers: {
//             Authorization: `Basic ${basicAuth}`,
//           },
//         }
//       );

//       localStorage.setItem(
//         "superadmin_auth",
//         JSON.stringify({
//           type: "basic",
//           username: credentials.username,
//           password: credentials.password,
//         })
//       );

//       return response.data;
//     }
//   },

//   logout() {
//     localStorage.removeItem("auth");
//     localStorage.removeItem("superadmin_auth");
//   },

//   getAuthHeaders() {
//     const auth = localStorage.getItem("auth");
//     if (auth) {
//       const { tenantCode, userCode, apiKey } = JSON.parse(auth);
//       return {
//         "X-Tenant-Code": tenantCode,
//         "X-User-Code": userCode,
//         "X-API-Key": apiKey,
//       };
//     }
//     return null;
//   },

//   getSuperadminAuthHeader() {
//     const auth = localStorage.getItem("superadmin_auth");
//     if (auth) {
//       const { type, token, username, password } = JSON.parse(auth);
//       if (type === "bearer") {
//         return `Bearer ${token}`;
//       } else {
//         return `Basic ${btoa(`${username}:${password}`)}`;
//       }
//     }
//     return null;
//   },

//   isAuthenticated() {
//     return !!(
//       localStorage.getItem("auth") || localStorage.getItem("superadmin_auth")
//     );
//   },

//   isSuperadmin() {
//     return !!localStorage.getItem("superadmin_auth");
//   },

//   getCurrentUser() {
//     const auth = localStorage.getItem("auth");
//     if (auth) {
//       const { user } = JSON.parse(auth);
//       return user;
//     }
//     return null;
//   },
// };
