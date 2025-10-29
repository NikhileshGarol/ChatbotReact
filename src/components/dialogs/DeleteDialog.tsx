import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (id?: any) => void;
  title: string;
  content?: string;
  id?: any;
};

export default function DeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  id,
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
          paddingY: "6px",
        }}
      >
        Delete {title}
        <IconButton sx={{ color: "background.default" }} onClick={onClose}>
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ paddingTop: "10px" }}>
          {content ? content : `Are you sure you want to delete this ${title}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={() => onConfirm(id)}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
