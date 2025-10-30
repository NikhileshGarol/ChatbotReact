// src/components/training/UploadDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { uploadFormSchema } from "../../validation/trainingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../contexts/AuthContext";
import { GridCloseIcon } from "@mui/x-data-grid";
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
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [reading, setReading] = React.useState(false);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      return;
    }
    const allowedExt = [
      // ".jpg",
      // ".jpeg",
      // ".png",
      // ".gif",
      // ".bmp",
      // ".svg",
      // ".webp", // images
      // ".pdf", // pdf
      // ".doc",
      // ".docx", // word documents
      // ".xls",
      // ".xlsx", // excel spreadsheets
      // ".ppt",
      // ".pptx", // presentations (optional)
      // ".txt",
      // ".rtf", // text files
      // ".csv", // comma-separated values
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

    function isAllowedFile(fileName: string): boolean {
      const lowerFileName = fileName.toLowerCase();
      return allowedExt.some((ext) => lowerFileName.endsWith(ext));
    }
    const name = f.name.toLowerCase();
    const isAllowed = allowedExt.some((ext) => name.endsWith(ext));
    if (!isAllowed) {
      setError("Unsupported file type.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB allowed.");
      return;
    }
    setFile(f);
  };

  const readFileAsBase64 = (
    f: File
  ): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // result is like "data:<mime>;base64,...."
        if (result.indexOf(",") >= 0) {
          const parts = result.split(",");
          const meta = parts[0]; // data:<mime>;base64
          const mimeMatch = meta.match(/data:([^;]+);/);
          const mimeType = mimeMatch
            ? mimeMatch[1]
            : f.type || "application/octet-stream";
          resolve({ base64: parts[1], mimeType });
        } else {
          // fallback - treat entire string as base64
          resolve({
            base64: result,
            mimeType: f.type || "application/octet-stream",
          });
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(f);
    });
  };

  const onSubmit = async (data: any) => {
    setError(null);
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!user) {
      setError("User not authenticated.");
      return;
    }
    try {
      setReading(true);
      await uploadDocument(file);
      if (onUploaded) onUploaded();
      onClose();
      showSnackbar("success", "Document uploaded successfully");
    } catch (e: any) {
      const message = e?.response?.data?.detail || "Something went wrong";
      showSnackbar("error", message);
    } finally {
      setReading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="sm">
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
        Upload Document
        <IconButton sx={{ color: "background.default" }}>
          <GridCloseIcon onClick={handleClose} />
        </IconButton>
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Button variant="outlined" component="label" disabled={reading}>
                Select file
                <input hidden type="file" onChange={onFileSelect} />
              </Button>
              <Box sx={{ mt: 1 }}>
                {file ? (
                  <Typography variant="body2">
                    {file.name} · {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No file selected
                  </Typography>
                )}
                {error && (
                  <Typography variant="caption" color="error" display="block">
                    {error}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* <RHFTextField name="title" label="Title (optional)" />
            <RHFTextField name="description" label="Description (optional)" /> */}
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={handleClose} disabled={reading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={reading}>
              {reading ? "Uploading..." : "Upload"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
      {/* Loading Overlay */}
      <LoadingOverlay loading={reading} content="File Upload inprogress..." />
    </Dialog>
  );
}
