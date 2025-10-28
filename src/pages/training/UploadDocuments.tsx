// src/pages/training/UploadDocuments.tsx
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import UploadDialog from "../../components/training/UploadDialog";
import { useAuth } from "../../contexts/AuthContext";
import {
  getDocumentsForUser,
  startTrainingForUser,
  getJobsForUser,
} from "../../store/trainingMock";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LogsDialog from "../../components/training/LogsDialog";
import PreviewDialog from "../../components/training/PreviewDialog";
import DownloadIcon from "@mui/icons-material/Download";
import type { TrainingJob, TrainingDocument } from "../../store/trainingMock";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import { deleteDocument, listDocuments } from "../../services/training.service";
import type { DocumentOut } from "../../services/types";
import CustomTable from "../../components/CustomTable";
import type { GridColDef } from "@mui/x-data-grid";
import type { User } from "../../store/mockData";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function UploadDocuments() {
  const { user } = useAuth();
  const [openUpload, setOpenUpload] = useState(false);
  const [docs, setDocs] = useState<DocumentOut[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<TrainingJob | null>(null);
  const [logsOpen, setLogsOpen] = useState(false);

  const [previewDoc, setPreviewDoc] = useState<TrainingDocument | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const [scopeUserId, setScopeUserId] = useState<string | "all" | "me">("all");

  useEffect(() => {
    refresh();
  }, [scopeUserId]);

  // useEffect(() => {
  //   refresh();
  //   const t = setInterval(refresh, 1200);
  //   return () => clearInterval(t);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [scopeUserId, user]);

  const refresh = async () => {
    if (!user) return;
    try {
      const myDocsOnly = scopeUserId === "all" ? "false" : "true";
      const documents = await listDocuments({ my_docs_only: myDocsOnly });
      setDocs(documents);
      setJobs(documents);
    } catch (error) {
      console.error(error);
    }
    // const uid = scopeUserId === "all" ? undefined : scopeUserId ?? user.id;
    // setDocs(getDocumentsForUser(uid) as TrainingDocument[]);
    // setJobs(getJobsForUser(uid) as TrainingJob[]);
  };

  const onUploaded = () => refresh();

  const handleDelete = (id: number) => {
    console.log(id);
    setOpenDeleteDialog(true);
    setSelectedRow(id);
  };

  const confirmDelete = () => {
    handleDeleteDocument();
  };

  const handleDeleteDocument = async () => {
    try {
      const resp = await deleteDocument(selectedRow);
      setOpenDeleteDialog(false);
      setSelectedRow(null);
      refresh();
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartTraining = (docId: string) => {
    if (!user) return;
    startTrainingForUser(user.id, [docId]);
    refresh();
  };

  const handleViewLogs = (jobId: string) => {
    const job = getJobsForUser(undefined).find((j) => j.id === jobId) ?? null;
    setSelectedJob(job);
    setLogsOpen(true);
  };

  const handlePreview = (doc: any) => {
    setPreviewDoc(doc);
    setPreviewOpen(true);
  };

  const handleDownload = (doc: any) => {
    if (!doc.contentBase64) {
      alert("No file content available to download.");
      return;
    }
    try {
      const byteCharacters = atob(doc.contentBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const mime = doc.mimeType ?? "application/octet-stream";
      const blob = new Blob([byteArray], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to download file.");
    }
  };

  const isAdmin = user?.role === "admin";

  const columns: GridColDef[] = [
    { field: "filename", headerName: "Title" },
    { field: "original_name", headerName: "File Name" },
    { field: "uploader_id", headerName: "Uploaded By" },
    {
      field: "created_at",
      headerName: "Uploaded At",
      renderCell: (params) => {
        const date = params?.row?.created_at;
        const localFormatted = dayjs
          .utc(date)
          .local()
          .format("DD-MM-YYYY hh:mm A");

        return <span>{localFormatted}</span>;
      },
    },
    { field: "status", headerName: "Status" },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <>
            <IconButton
              size="small"
              onClick={() => handlePreview(row)}
              title="Preview"
            >
              {" "}
              <VisibilityIcon />{" "}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDownload(row)}
              title="Download"
            >
              <DownloadIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDelete(row.id)}
              title="Delete"
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Documents & Training (Per User)</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => setOpenUpload(true)}>
              Upload document
            </Button>
            {/* <Button
              variant="contained"
              onClick={() => {
                if (!user) return;
                const uId =
                  scopeUserId === "all" ? undefined : scopeUserId ?? user.id;
                const docsToTrain = (getDocumentsForUser(uId) || [])
                  .filter((d) => d.status === "pending")
                  .map((d) => d.id);
                if (docsToTrain.length === 0) {
                  alert("No pending documents to train.");
                  return;
                }
                startTrainingForUser(user.id, docsToTrain);
                refresh();
              }}
            >
              Train all pending
            </Button> */}
          </Box>
        </Box>

        {isAdmin && (
          <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="scope-label">Scope</InputLabel>
              <Select
                labelId="scope-label"
                value={scopeUserId}
                label="Scope"
                onChange={(e) => setScopeUserId(e.target.value as any)}
              >
                <MenuItem value="me">Me</MenuItem>
                <MenuItem value="all">All users</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              As Admin you can view all users when selecting "All users".
            </Typography>
          </Box>
        )}

        {/* <Paper sx={{ p: 2, mb: 3 }}> */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Uploaded Documents
        </Typography>
        {/* <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Filename</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width={220}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {docs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary">
                      No documents uploaded.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                docs.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d?.filename}</TableCell>
                    <TableCell>{d?.original_name}</TableCell>
                    <TableCell>
                      {new Date(d.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={d.status}
                        size="small"
                        color={
                          d.status === "completed"
                            ? "success"
                            : d.status === "failed"
                            ? "error"
                            : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        // onClick={() => handleStartTraining(d.id)}
                        title="Start training"
                      >
                        <PlayArrowIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (d.jobId) handleViewLogs(d.jobId);
                          else alert("No training job associated yet.");
                        }}
                        title="View logs"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handlePreview(d)}
                        title="Preview"
                      >
                        {" "}
                        <VisibilityIcon />{" "}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(d)}
                        title="Download"
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(d.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table> */}
        <CustomTable gridRows={docs} columns={columns} />
        {/* </Paper> */}

        {/* <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Training Jobs
          </Typography>
          {jobs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No training jobs.
            </Typography>
          ) : (
            jobs.map((j) => (
              <Paper
                key={j.id}
                sx={{
                  p: 1,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle2">{j.id}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {j.status} · {j.progress}% ·{" "}
                    {new Date(j.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    onClick={() => {
                      setSelectedJob(j);
                      setLogsOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Logs
                  </Button>
                  <Button
                    onClick={() => {
                      const newJob = startTrainingForUser(
                        j.userId,
                        j.documentIds
                      );
                      setTimeout(() => {
                        refresh();
                      }, 500);
                      alert(`New retrain job ${newJob.id} created.`);
                    }}
                    variant="outlined"
                  >
                    Retrain
                  </Button>
                </Box>
              </Paper>
            ))
          )}
        </Paper> */}
      </Box>

      <UploadDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={onUploaded}
      />
      <LogsDialog
        open={logsOpen}
        job={selectedJob ?? undefined}
        onClose={() => setLogsOpen(false)}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title="Delete File"
        content="Are you sure you want to delete this file?"
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDelete}
      />
      <PreviewDialog
        open={previewOpen}
        doc={previewDoc ?? undefined}
        onClose={() => setPreviewOpen(false)}
      />
    </AdminLayout>
  );
}
