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
  title: string;
  content?: string;
  data?: any;
  loading?: boolean;
};

export default function DeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  data,
  loading,
}: Props) {
  return (
    <Dialog open={open} maxWidth={"sm"}>
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
        <Typography>Delete {title}</Typography>
        <IconButton sx={{ color: "background.default" }} onClick={onClose}>
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ paddingY: "15px" }}>
          <Typography fontSize={15} variant="body2">
            {content
              ? content
              : `Are you sure you want to delete this ${title}?`}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ boxShadow: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="contained"
          onClick={() => onConfirm(data)}
        >
          {loading ? "Deleting.." : "Delete"}
        </Button>
      </DialogActions>
      {loading && <LoadingOverlay content="Deleting.." loading={loading} />}
    </Dialog>
  );
}
