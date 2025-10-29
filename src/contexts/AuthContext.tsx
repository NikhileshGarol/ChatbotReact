import React, { createContext, useContext, useEffect, useState } from "react";
import { login } from "../services/auth.service";
import { getCurrentUser, getUserImage } from "../services/user.service";
import { useSnackbar } from "./SnackbarContext";

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
  setUser: React.Dispatch<React.SetStateAction<any>>;
  profileImage: string | null;
  refreshProfileImage: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showSnackbar } = useSnackbar();
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<any | null>(null);
  const [refreshToken, setRefreshToken] = useState<any | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const STORAGE_KEY = "AUTH_STORAGE_V1";

  useEffect(() => {
    if (token && refreshToken) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: token, refreshToken: refreshToken })
      );
      getUserDetails();
      getProfileImage();
    } else {
      // localStorage.removeItem(STORAGE_KEY);
    }
  }, [token]);

  const getProfileImage = async () => {
    try {
      const response = await getUserImage(); // response is a Blob
      const objectUrl = URL.createObjectURL(response);
      setProfileImage(objectUrl);
    } catch (error) {
      console.error(error);
      setProfileImage(null);
    }
  };

  const userLogin = async (username: string, password: string) => {
    try {
      const resp = await login(username, password);
      setToken(resp.access_token);
      setRefreshToken(resp.refresh_token);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      showSnackbar("error", message);
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
    localStorage.removeItem(STORAGE_KEY);
    // // Avoid back navigation to privileged pages by replacing history state
    try {
      window.history.replaceState({}, "", "/auth/login");
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        userLogin,
        Logout,
        setUser,
        profileImage,
        refreshProfileImage: getProfileImage,
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
