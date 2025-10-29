import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { GridCloseIcon } from "@mui/x-data-grid";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<string>) => void;
  isLoading: false | boolean;
};

export function WebsiteUploadDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleSubmit = () => {
    if (websiteUrl && !isLoading) {
      onSubmit(websiteUrl);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "primary.main",
          paddingY: "8px",
          alignItems: "center",
          color: "background.default",
        }}
      >
        Upload Website URL
        <IconButton sx={{ color: "background.default" }}>
          <GridCloseIcon onClick={onClose} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 4 }}>
        <Typography variant="subtitle2">
          Website URL <span style={{ color: "#D32F2F" }}>*</span>
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          type="url"
          fullWidth
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={isLoading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<UploadIcon />}
          disabled={!websiteUrl || isLoading}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
