import React, { createContext, useContext, useEffect, useState } from "react";
import { login } from "../services/auth.service";
import { getCurrentUser } from "../services/user.service";

type AuthContextType = {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  userLogin: (
    username: string,
    password: string,
    checked: boolean
  ) => Promise<any>;
  Logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<any | null>(null);

  const STORAGE_KEY = "AUTH_STORAGE_V1";

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: token }));
      getUserDetails();
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token]);

  const userLogin = async (
    username: string,
    password: string,
    checked: boolean
  ) => {
    try {
      const resp = await login(username, password);
      setToken(resp.access_token);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response);
    } catch (error) {
      console.error(error);
    }
  };

  const Logout = () => {
    setUser(null);
    setToken(null);
    // // Avoid back navigation to privileged pages by replacing history state
    // try {
    //   window.history.replaceState({}, "", "/auth/login");
    // } catch (e) {
    //   // ignore
    // }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        userLogin,
        // superAdminLogin,
        Logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// import React, { createContext, useContext, useEffect, useState } from 'react';

// export type Role = 'superadmin' | 'admin' | 'user' | null;

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: Role;
//   companyId?: string | null;
// };

// type AuthContextType = {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<User>;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const STORAGE_KEY = 'mock_auth_v2';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       return raw ? JSON.parse(raw).user : null;
//     } catch {
//       return null;
//     }
//   });
//   const [token, setToken] = useState<string | null>(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       return raw ? JSON.parse(raw).token : null;
//     } catch {
//       return null;
//     }
//   });

//   useEffect(() => {
//     if (user && token) {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
//     } else {
//       localStorage.removeItem(STORAGE_KEY);
//     }
//   }, [user, token]);

//   const login = async (email: string, _password: string) => {
//     // Mock role mapping:
//     // - email contains 'super' => superadmin
//     // - email contains 'admin' => company admin
//     // - otherwise => regular user
//     const lower = email.toLowerCase();
//     let role: Role = 'user';
//     if (lower.includes('super')) role = 'superadmin';
//     else if (lower.includes('admin')) role = 'admin';
//     else role = 'user';

//     // Mock company assignment:
//     // superadmin has no companyId,
//     // admin and user belong to company_1 in mock mode (adjust later)
//     const mockUser: User = {
//       id: `u_${Math.random().toString(36).slice(2, 9)}`,
//       name: role === 'superadmin' ? 'Platform Admin' : role === 'admin' ? 'Company Admin' : 'Standard User',
//       email,
//       role,
//       companyId: role === 'superadmin' ? null : 'c_1',
//     };
//     const mockToken = `mock-token-${Date.now()}`;

//     // simulate latency
//     await new Promise((res) => setTimeout(res, 400));

//     setUser(mockUser);
//     setToken(mockToken);

//     return mockUser;
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     // Avoid back navigation to privileged pages by replacing history state
//     try {
//       window.history.replaceState({}, '', '/auth/login');
//     } catch (e) {
//       // ignore
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// };
