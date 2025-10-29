// SnackbarContext.tsx
import React, { createContext, useContext, useState } from "react";
import CustomSnackbar from "../components/CustomSnackbar";

type SnackbarType = "success" | "error" | "info" | "warning";
type SnackbarContextProps = {
  showSnackbar: (type: SnackbarType, message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined
);

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used within SnackbarProvider");
  return ctx;
};

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<SnackbarType>("info");
  const [message, setMessage] = useState<string>("");

  const showSnackbar = (newType: SnackbarType, newMessage: string) => {
    setType(newType);
    setMessage(newMessage);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <CustomSnackbar
        open={open}
        type={type}
        message={message}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
}
