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
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import RHFTextField from "../../components/RHF/RHFTextField";
import { uploadFormSchema } from "../../validation/trainingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDocumentForUser } from "../../store/trainingMock";
import { useAuth } from "../../contexts/AuthContext";
import { GridCloseIcon } from "@mui/x-data-grid";
import { uploadDocument } from "../../services/training.service";

type Props = {
  open: boolean;
  onClose: () => void;
  onUploaded?: () => void;
};

export default function UploadDialog({ open, onClose, onUploaded }: Props) {
  const methods = useForm({ resolver: yupResolver(uploadFormSchema) });
  const { handleSubmit } = methods;
  const { user } = useAuth();

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
    const allowedExt = [".pdf"];
    const name = f.name.toLowerCase();
    const isAllowed = allowedExt.some((ext) => name.endsWith(ext));
    if (!isAllowed) {
      setError("Unsupported file type. Allowed: PDF");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File too large. Max 20MB allowed.");
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
      const resp = await uploadDocument(file);
      console.log(resp);
      // const { base64, mimeType } = await readFileAsBase64(file);
      // // Store metadata + contentBase64 in mock store
      // addDocumentForUser(user.id, {
      //   filename: file.name,
      //   title: data.title ?? file.name,
      //   description: data.description ?? "",
      //   size: file.size,
      //   contentBase64: base64,
      //   mimeType,
      // });
      if (onUploaded) onUploaded();
      onClose();
    } catch (e) {
      console.error(e);
      setError("Failed to read file.");
    } finally {
      setReading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
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
        Upload Document
        <IconButton sx={{ color: "background.default" }}>
          <GridCloseIcon onClick={onClose} />
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

            <RHFTextField name="title" label="Title (optional)" />
            <RHFTextField name="description" label="Description (optional)" />
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} disabled={reading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={reading}>
              {reading ? "Uploading..." : "Upload"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
