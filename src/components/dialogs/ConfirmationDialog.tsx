import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import LoadingOverlay from "../LoadingOverlay";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data?: any) => void;
  title?: string;
  content?: string;
  data?: any;
  loading?: boolean;
};

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  content,
  data,
  loading,
}: Props) {
  return (
    <Dialog open={open}>
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "background.default",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: "2px",
        }}
      >
        <Typography>Confirmation</Typography>
        <IconButton sx={{ color: "background.default" }} onClick={onClose}>
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ paddingY: "15px" }}>
          <Typography fontSize={15} variant="body2">
            {content}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="contained"
          onClick={() => onConfirm(data)}
        >
          {loading ? "Continue.." : "Continue"}
        </Button>
      </DialogActions>
      {loading && <LoadingOverlay loading={loading} />}
    </Dialog>
  );
}
