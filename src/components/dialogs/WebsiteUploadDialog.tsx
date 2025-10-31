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
  Box,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { GridCloseIcon } from "@mui/x-data-grid";
import LoadingOverlay from "../LoadingOverlay";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: string[]) => void;
  isLoading: boolean;
};

export function WebsiteUploadDialog({
  open,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const [urls, setUrls] = useState<string[]>([""]);
  const [error, setError] = useState<(string | null)[]>([]);

  const handleUrlChange = (index: number, value: string) => {
    const newErrors = [...error];
    if (value.trim() === "" || isValidUrl(value)) {
      newErrors[index] = null; // clear error
    } else {
      newErrors[index] = "Invalid URL";
    }
    setError(newErrors);
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAddField = () => {
    if (urls.length < 5) {
      setUrls([...urls, ""]);
    }
  };

  const handleRemoveField = (index: number) => {
    if (urls.length === 1) return; // Prevent removing last field
    setUrls(urls.filter((_, idx) => idx !== index));
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    // Filter out empty URLs if desired
    const filteredUrls = urls.filter((url) => url.trim() !== "");
    const noErrors = error.every((err) => err === null || err === "");

    if (filteredUrls.length > 0 && !isLoading && noErrors) {
      onSubmit(filteredUrls);
      setUrls([""]);
    }
  };

  const handleClose = () => {
    setUrls([""]);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "primary.main",
          paddingY: "2px",
          alignItems: "center",
          color: "background.default",
        }}
      >
        Scrape Website
        <IconButton sx={{ color: "background.default" }} onClick={handleClose}>
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          Website URLs <span style={{ color: "#D32F2F" }}>*</span>
        </Typography>

        {urls.map((url, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
          >
            <TextField
              autoFocus={index === urls.length - 1}
              type="url"
              fullWidth
              placeholder="https://example.com"
              value={url}
              disabled={isLoading}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              error={!!error[index]}
              helperText={error[index]}
            />
            <IconButton
              onClick={() => handleRemoveField(index)}
              disabled={isLoading || urls.length === 1}
              color="error"
              aria-label="remove url field"
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
            {index === urls.length - 1 && (
              <IconButton
                onClick={handleAddField}
                disabled={isLoading || urls.length >= 5}
                color="primary"
                aria-label="add url field"
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={urls.every((url) => url.trim() === "") || isLoading}
        >
          {isLoading ? "Scraping..." : "Scrape"}
        </Button>
      </DialogActions>
      {/* Loading Overlay */}
      <LoadingOverlay loading={isLoading} content="Scraping inprogress..." />
    </Dialog>
  );
}
