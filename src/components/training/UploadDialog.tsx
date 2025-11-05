// src/components/training/UploadDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { uploadFormSchema } from "../../validation/trainingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../contexts/AuthContext";
import { GridCloseIcon } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import { uploadDocument } from "../../services/training.service";
import { useSnackbar } from "../../contexts/SnackbarContext";
import LoadingOverlay from "../LoadingOverlay";

type Props = {
  open: boolean;
  onClose: () => void;
  onUploaded?: () => void;
};

export default function UploadDialog({ open, onClose, onUploaded }: Props) {
  const methods = useForm({ resolver: yupResolver(uploadFormSchema) });
  const { handleSubmit } = methods;
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [reading, setReading] = React.useState(false);

  const allowedExt = [
    ".pdf",
    ".docx",
    ".doc",
    ".xlsx",
    ".xls",
    ".pptx",
    ".ppt",
    ".txt",
    ".csv",
    ".md",
    ".rst",
    ".log",
  ];

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const totalFiles = files.length + selected.length;
    if (totalFiles > 5) {
      setError("You can upload a maximum of 5 files at a time.");
      return;
    }

    const invalidFiles = selected.filter((f) => {
      const ext = f.name.toLowerCase();
      const isAllowed = allowedExt.some((a) => ext.endsWith(a));
      return !isAllowed || f.size > 5 * 1024 * 1024;
    });

    if (invalidFiles.length > 0) {
      setError(`Some files are invalid. Allowed types: ${allowedExt} and size up to 5MB each.`);
      return;
    }

    setFiles((prev) => [...prev, ...selected]);
    e.target.value = ""; // reset input to allow reselecting same files if needed
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    setError(null);

    if (!files.length) {
      setError("Please select files to upload.");
      return;
    }

    if (!user) {
      setError("User not authenticated.");
      return;
    }

    try {
      setReading(true);
      await uploadDocument(files);
      if (onUploaded) onUploaded();
      showSnackbar("success", "All documents uploaded successfully");
      setTimeout(handleClose, 100);
    } catch (e: any) {
      const message = e?.response?.data?.detail || "Upload failed. Try again.";
      showSnackbar("error", message);
    } finally {
      setReading(false);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setError(null);
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
        Upload Documents
        <IconButton sx={{ color: "background.default" }} onClick={handleClose}>
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Button variant="outlined" component="label" disabled={reading}>
                Select files
                <input
                  hidden
                  type="file"
                  multiple
                  onChange={onFileSelect}
                  accept={allowedExt.join(",")}
                />
              </Button>

              <Box sx={{ mt: 2 }}>
                {files.length > 0 ? (
                  <List dense>
                    {files.map((file, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          py: 0,
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(1)} KB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeFile(idx)}
                            disabled={reading}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No files selected
                  </Typography>
                )}

                {error && (
                  <Typography variant="caption" color="error" display="block" mt={1}>
                    {error}
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={handleClose} disabled={reading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={reading || !files.length}>
              {reading ? "Uploading..." : "Upload"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>

      <LoadingOverlay loading={reading} content="File Upload in progress..." />
    </Dialog>
  );
}
