import React, { createContext, useContext, useState } from "react";

interface SessionContextValue {
  sessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionExpired, setSessionExpired] = useState(false);

  return (
    <SessionContext.Provider value={{ sessionExpired, setSessionExpired }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
};
