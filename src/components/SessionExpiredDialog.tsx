import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useSession } from "../contexts/SessionContext";

const SessionExpiredDialog: React.FC = () => {
  const { sessionExpired, setSessionExpired } = useSession();

  const handleLoginRedirect = () => {
    setSessionExpired(false);
    localStorage.removeItem("AUTH_STORAGE_V1");
    window.location.href = "/auth/login"; // or use router push
  };

  return (
    <Dialog open={sessionExpired}>
      <DialogTitle>Session Expired</DialogTitle>
      <DialogContent>
        <Typography>Your session has expired. Please log in again.</Typography>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoginRedirect}
        >
          Login Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog;
