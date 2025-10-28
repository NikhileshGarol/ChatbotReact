// src/components/training/PreviewDialog.tsx
import { useMemo } from "react";
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
import type { TrainingDocument } from "../../store/trainingMock";
import { GridCloseIcon } from "@mui/x-data-grid";

type Props = {
  open: boolean;
  doc?: TrainingDocument | null;
  onClose: () => void;
};

export default function PreviewDialog({ open, doc, onClose }: Props) {
  const blobUrl = useMemo(() => {
    if (!doc || !doc.contentBase64) return null;
    try {
      // create blob from base64
      const byteCharacters = atob(doc.contentBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const mime = doc.mimeType ?? "application/octet-stream";
      const blob = new Blob([byteArray], { type: mime });
      return URL.createObjectURL(blob);
    } catch (e) {
      return null;
    }
  }, [doc]);

  if (!doc) return null;

  const lower = doc.filename.toLowerCase();
  const isPdf = doc.mimeType === "application/pdf" || lower.endsWith(".pdf");
  const isText =
    lower.endsWith(".txt") ||
    lower.endsWith(".csv") ||
    doc.mimeType?.startsWith("text/");
  const isDocx =
    lower.endsWith(".docx") ||
    doc.mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
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
        <IconButton sx={{ color: "background.default" }}>
          <GridCloseIcon onClick={onClose} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Filename: {doc.filename} · Uploaded:{" "}
            {new Date(doc.uploadedAt).toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            height: "70vh",
            border: "1px solid #eee",
            borderRadius: 1,
            overflow: "auto",
          }}
        >
          {isPdf && blobUrl ? (
            // use object/embed for PDF
            <object
              data={blobUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body2">
                  PDF preview not supported by your browser.{" "}
                  <a href={blobUrl} target="_blank" rel="noreferrer">
                    Open in new tab
                  </a>
                </Typography>
              </Box>
            </object>
          ) : isText && doc.contentBase64 ? (
            // decode base64 to text
            <Box sx={{ p: 2 }}>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "monospace",
                }}
              >
                {(() => {
                  try {
                    // atob may throw for large payloads; wrap in try
                    return decodeURIComponent(escape(atob(doc.contentBase64)));
                  } catch (e) {
                    // fallback: attempt atob only
                    try {
                      return atob(doc.contentBase64);
                    } catch {
                      return "Unable to render text preview.";
                    }
                  }
                })()}
              </pre>
            </Box>
          ) : isDocx ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="body1">
                DOCX preview is not supported in-app yet.
              </Typography>
              {blobUrl && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <a href={blobUrl} download={doc.filename}>
                    Download DOCX
                  </a>
                </Typography>
              )}
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 2 }}
              >
                To view DOCX inline, integrate a backend conversion endpoint to
                convert DOCX → HTML or PDF.
              </Typography>
            </Box>
          ) : blobUrl ? (
            // generic fallback: allow download / open
            <Box sx={{ p: 3 }}>
              <Typography variant="body2">
                Preview not available for this file type.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <a href={blobUrl} target="_blank" rel="noreferrer">
                  Open file in new tab
                </a>
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography variant="body2">No preview available.</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {blobUrl && (
          <Button component="a" href={blobUrl} download={doc.filename}>
            Download
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
