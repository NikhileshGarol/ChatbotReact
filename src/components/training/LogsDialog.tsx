// src/components/training/LogsDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import type { TrainingJob } from "../../store/trainingMock";
import { GridCloseIcon } from "@mui/x-data-grid";

type Props = {
  open: boolean;
  job?: TrainingJob | null;
  onClose: () => void;
};

export default function LogsDialog({ open, job, onClose }: Props) {
  if (!job) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
        Training Job Logs
        <IconButton sx={{ color: "background.default" }}>
          <GridCloseIcon onClick={onClose} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Job ID: {job.id}</Typography>
          <Typography variant="body2">
            Status: {job.status} · Progress: {job.progress}%
          </Typography>
          <Typography variant="body2">
            Created: {new Date(job.createdAt).toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "#fafafa",
            p: 2,
            borderRadius: 1,
            maxHeight: 340,
            overflowY: "auto",
          }}
        >
          {job.logs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No logs available
            </Typography>
          ) : (
            job.logs.map((l, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                {l}
              </Typography>
            ))
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
