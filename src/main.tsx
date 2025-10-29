import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import theme from "./theme/muiTheme";
import { AuthProvider } from "./contexts/AuthContext";

import "./index.css";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { SessionProvider } from "./contexts/SessionContext";
import SessionExpiredDialog from "./components/SessionExpiredDialog";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        {/* <SessionListener /> */}
        <SessionExpiredDialog />
        <SnackbarProvider>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          </AuthProvider>
        </SnackbarProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
