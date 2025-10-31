import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import UploadDialog from "../../components/training/UploadDialog";
import { useAuth } from "../../contexts/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import LogsDialog from "../../components/training/LogsDialog";
import PreviewDialog from "../../components/training/PreviewDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { TrainingJob, TrainingDocument } from "../../store/trainingMock";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import {
  deleteDocument,
  deleteWebsite,
  listDocuments,
  listDocumentsSuperadmin,
  listWebsite,
  listWebsitesSuperadmin,
  previvewDocSuperadmin,
  previvewDocUser,
  uploadWebsite,
} from "../../services/training.service";
import type { DocumentOut, FilterOption } from "../../services/types";
import CustomTable from "../../components/CustomTable";
import { GridDownloadIcon, type GridColDef } from "@mui/x-data-grid";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { WebsiteUploadDialog } from "../../components/dialogs/WebsiteUploadDialog";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { listCompanies } from "../../services/company.service";
import { useEffectOnce } from "../../hooks/useEffectOnce";
import formatDateLocal from "../../utils/formatDateLocal";

export default function UploadDocuments() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "superadmin";
  const { showSnackbar } = useSnackbar();
  const [openUpload, setOpenUpload] = useState(false);
  const [docs, setDocs] = useState<DocumentOut[]>([]);
  const [selectedJob, setSelectedJob] = useState<TrainingJob | null>(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [websiteDialogOpen, setWebsiteDialogOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [websites, setWebsites] = useState([]);
  const [deleteType, setDeleteType] = useState<string | "document" | "website">(
    ""
  );
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [scopeUserId, setScopeUserId] = useState<string | null>("all");
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);

  const UserFilerOptions = [
    { label: "Me", value: "me" },
    { label: "All Users", value: "all" },
  ];

  useEffectOnce(() => {
    async function fetchAndSetOptions() {
      if (isSuperAdmin) {
        const companies = await listCompanies();
        const optionsFromCompanies = companies?.map((c: any) => ({
          label: c.name,
          value: c.tenant_code,
        }));
        setFilterOptions(optionsFromCompanies);
      } else {
        setFilterOptions(UserFilerOptions);
      }
    }
    fetchAndSetOptions();
  });

  useEffect(() => {
    if (tabIndex === 1) {
      if (isSuperAdmin) {
        listSuperadminWeb();
      } else {
        fetchWebsites();
      }
    } else {
      if (isSuperAdmin) {
        listAllSuperadminDocs();
      } else {
        listAllUserDocs();
      }
    }
  }, [tabIndex, scopeUserId]);

  const listAllUserDocs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const myDocsOnly = scopeUserId === "all" ? "false" : "true";
      const documents = await listDocuments({ my_docs_only: myDocsOnly });
      setDocs(documents);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const listAllSuperadminDocs = async () => {
    const filter = scopeUserId === "all" ? "" : scopeUserId;
    const payload = {
      tenant_code: filter || undefined,
    };
    try {
      setLoading(true);
      const response = await listDocumentsSuperadmin(payload);
      setDocs(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchWebsites = async () => {
    const myDocsOnly = scopeUserId === "all" ? "false" : "true";
    try {
      setLoading(true);
      const response = await listWebsite({ my_docs_only: myDocsOnly });
      setWebsites(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const listSuperadminWeb = async () => {
    const filter = scopeUserId === "all" ? "" : scopeUserId;
    const payload = {
      tenant_code: filter || undefined,
    };
    try {
      setLoading(true);
      const response = await listWebsitesSuperadmin(payload);
      setWebsites(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWebsiteUpload = async (websiteUrl: string[]) => {
    console.log(websiteUrl);
    setIsLoading(true);
    const payload = {
      url: websiteUrl[0],
    };
    try {
      await uploadWebsite(payload);
      showSnackbar("success", "Website uploaded successfully");
      setIsLoading(false);
      setWebsiteDialogOpen(false);
      fetchWebsites();
    } catch (e: any) {
      const message = e?.response.data.detail || "something went wrong";
      showSnackbar("error", message);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onUploaded = () => {
    setTabIndex(0);
    listAllUserDocs();
  };

  const handleDelete = (id: number, type: "document" | "website") => {
    setOpenDeleteDialog(true);
    setSelectedRow(id);
    setDeleteType(type);
  };

  const confirmDelete = () => {
    if (deleteType === "document") {
      handleDeleteDocument();
    } else {
      handleDeletWebsite();
    }
  };

  const handleDeletWebsite = async () => {
    try {
      const resp = await deleteWebsite(selectedRow);
      setOpenDeleteDialog(false);
      setSelectedRow(null);
      setDeleteType("");
      fetchWebsites();
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      const resp = await deleteDocument(selectedRow);
      setOpenDeleteDialog(false);
      setSelectedRow(null);
      setDeleteType("");
      listAllUserDocs();
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleStartTraining = (docId: string) => {
  //   if (!user) return;
  //   startTrainingForUser(user.id, [docId]);
  //   listAllUserDocs();
  // };

  // const handleViewLogs = (jobId: string) => {
  //   const job = getJobsForUser(undefined).find((j) => j.id === jobId) ?? null;
  //   setSelectedJob(job);
  //   setLogsOpen(true);
  // };

  const handlePreview = (doc: any) => {
    setPreviewDoc(doc);
    setPreviewOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleDownload = async (row: any) => {
    try {
      let response;
      if (isSuperAdmin) {
        response = await previvewDocSuperadmin(row.id);
      } else {
        response = await previvewDocUser(row.id);
      }
      // Create blob from response
      const blob =
        response instanceof Blob ? response : await response.blob?.();
      const url = URL.createObjectURL(blob);
      // Create an anchor and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = row.filename; // or fallback name from backend
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("File download failed:", error);
      showSnackbar("error", "File download failed");
    }
  };

  const handleOpenWebLink = (row: any) => {
    if (!row || !row.url) return;
    window.open(row.url, "_blank", "noopener,noreferrer");
  };

  const columns: GridColDef[] = [
    {
      field: "company_name",
      headerName: "Company Name",
      valueGetter: (params) => {
        return params || "-";
      },
    },
    { field: "original_name", headerName: "File Name" },
    { field: "user_name", headerName: "Uploaded By" },
    {
      field: "created_at",
      headerName: "Uploaded At",
      renderCell: (params) => {
        const date = params?.row?.created_at;
        const localFormatted = formatDateLocal(date);

        return <span>{localFormatted}</span>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 140,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box sx={{ display: "flex", mt: "5px" }}>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handlePreview(row)}
              title="Preview"
            >
              <VisibilityIcon />
            </IconButton>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: "2px", mt: 1, borderColor: "grey.300" }}
            />
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleDownload(row)}
              title="Download"
            >
              <GridDownloadIcon />
            </IconButton>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: "2px", mt: 1, borderColor: "grey.300" }}
            />
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleDelete(row.id, "document")}
              title="Delete"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const websiteColumns: GridColDef[] = [
    { field: "company_name", headerName: "Company Name" },
    { field: "title", headerName: "Website Title" },
    { field: "url", headerName: "Website URL" },
    { field: "user_name", headerName: "Scraped By" },
    {
      field: "created_at",
      headerName: "Scraped At",
      renderCell: (params) => {
        const date = params?.row?.created_at;
        const localFormatted = formatDateLocal(date);

        return <span>{localFormatted}</span>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box sx={{ display: "flex", mt: "5px" }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenWebLink(row)}
              title="Visit website"
            >
              <OpenInNewIcon />
            </IconButton>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: "2px", mt: 1, borderColor: "grey.300" }}
            />
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleDelete(row.id, "website")}
              title="Delete"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
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
          <Typography variant="h6">Documents & Websites</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={() => setOpenUpload(true)}>
              Upload document
            </Button>
            <Button
              variant="contained"
              onClick={() => setWebsiteDialogOpen(true)}
            >
              Website
            </Button>
          </Box>
        </Box>

        {(isAdmin || isSuperAdmin) && (
          <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Typography>
                {isSuperAdmin ? "Filter by Compnay" : "Filter by User"}
              </Typography>
              <Select
                value={scopeUserId || "all"}
                onChange={(e) => setScopeUserId(e.target.value as any)}
              >
                {isSuperAdmin && <MenuItem value="all">All</MenuItem>}
                {filterOptions?.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="Documents and Websites Tabs"
        >
          <Tab label="Uploaded Documents" />
          <Tab label="Scraped Websites" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabIndex === 0 && (
            <CustomTable
              isLoading={loading}
              gridRows={docs}
              columns={columns}
            />
          )}
          {tabIndex === 1 && (
            <CustomTable
              isLoading={loading}
              gridRows={websites}
              columns={websiteColumns}
            />
          )}
        </Box>
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
        doc={previewDoc}
        onClose={() => setPreviewOpen(false)}
        isSuperadmin={isSuperAdmin}
      />
      <WebsiteUploadDialog
        open={websiteDialogOpen}
        onClose={() => setWebsiteDialogOpen(false)}
        onSubmit={handleWebsiteUpload}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}
