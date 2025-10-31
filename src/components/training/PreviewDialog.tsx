import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import {
  previvewDocSuperadmin,
  previvewDocUser,
} from "../../services/training.service";

type Props = {
  open: boolean;
  doc?: {
    id: number;
    filename: string;
    title?: string;
    created_at: string;
    mimeType?: string;
  } | null;
  onClose: () => void;
  isSuperadmin: boolean;
};

export default function PreviewDialog({
  open,
  doc,
  onClose,
  isSuperadmin,
}: Props) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doc || !open) return;
    let url: string | null = null;
    const fetchFile = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (isSuperadmin) {
          response = await previvewDocSuperadmin(doc.id);
        } else {
          response = await previvewDocUser(doc.id);
        }
        const blob =
          response instanceof Blob ? response : await response.blob?.();
        const mime =
          (response.headers?.get?.("content-type") as string) ||
          doc.mimeType ||
          blob?.type ||
          "application/octet-stream";

        url = URL.createObjectURL(blob);
        setFileUrl(url);
        setFileType(mime);
      } catch (err: any) {
        console.error("Error fetching preview file:", err);
        setError("Unable to load file preview.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
      setFileUrl(null);
      setFileType(null);
    };
  }, [open, doc]);

  if (!doc) return null;

  const lower = doc.filename.toLowerCase();
  const isPdf = fileType === "application/pdf" || lower.endsWith(".pdf");
  const isImage = /image\/(png|jpg|jpeg|gif|webp)/.test(fileType || "");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
      {/* Header */}
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
        Preview — {doc.title ?? doc.filename}
        <IconButton sx={{ color: "background.default" }} onClick={onClose}>
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Filename: {doc.filename} · Uploaded:{" "}
            {new Date(doc.created_at).toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            height: "70vh",
            border: "1px solid #eee",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            backgroundColor: "#fafafa",
          }}
        >
          {loading && <CircularProgress size={40} color="primary" />}

          {!loading && error && <Typography color="error">{error}</Typography>}

          {!loading && !error && isPdf && fileUrl && (
            <object
              data={fileUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              aria-label="PDF Preview"
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body2">
                  PDF preview not supported.{" "}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={doc.filename}
                  >
                    Open in new tab
                  </a>
                </Typography>
              </Box>
            </object>
          )}

          {!loading && !error && isImage && fileUrl && (
            <Box
              component="img"
              src={fileUrl}
              alt={doc.filename}
              sx={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          )}

          {!loading && !error && !isPdf && !isImage && fileUrl && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2">
                Preview not available for this file type.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={doc.filename}
                >
                  Download file
                </a>
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions>
        {fileUrl && (
          <Button component="a" href={fileUrl} download={doc.filename}>
            Download
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
