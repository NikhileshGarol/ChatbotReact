import * as React from "react";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type Props = {
  open: boolean;
  onClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
  type: "error" | "info" | "success" | "warning";
  message: string;
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
};

export default function CustomSnackbar({
  open,
  onClose,
  type,
  message,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
}: Props) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        variant="filled"
        severity={type}
        sx={{ width: "100%" }}
        onClose={onClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
