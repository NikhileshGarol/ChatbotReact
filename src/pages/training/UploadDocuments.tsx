import { useEffect, useState } from "react";
import { GridDownloadIcon, type GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../contexts/AuthContext";
import {
  deleteDocument,
  deleteWebsite,
  listDocuments,
  listDocumentsSuperadmin,
  listWebsite,
  listWebsitesSuperadmin,
  downloadDocSuperadmin,
  downloadDocUser,
  uploadWebsite,
  retryUploadDocs,
} from "../../services/training.service";
import type { DocumentOut, FilterOption } from "../../services/types";
import { WebsiteUploadDialog } from "../../components/dialogs/WebsiteUploadDialog";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { listAllCompaniesFilter } from "../../services/company.service";
import { useEffectOnce } from "../../hooks/useEffectOnce";
import formatDateLocal from "../../utils/formatDateLocal";
import CustomTable from "../../components/CustomTable";
import StatusCell from "../../components/StatusCell";
import AdminLayout from "../../layouts/AdminLayout";
import UploadDialog from "../../components/training/UploadDialog";
import DeleteDialog from "../../components/dialogs/DeleteDialog";

export default function UploadDocuments() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "superadmin";

  const [docs, setDocs] = useState<DocumentOut[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [openUpload, setOpenUpload] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [websiteDialogOpen, setWebsiteDialogOpen] = useState(false);

  const [scopeUserId, setScopeUserId] = useState<string | null>("all");
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [deleteType, setDeleteType] = useState<string | "document" | "website">(
    ""
  );

  //--------------Default FilterOPtions-----------

  const UserFilerOptions = [
    { label: "Me", value: "me" },
    { label: "All Users", value: "all" },
  ];

  //--------------Handle SideEffects--------------

  useEffectOnce(() => {
    async function fetchAndSetOptions() {
      if (isSuperAdmin) {
        const companies = await listAllCompaniesFilter();
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
  }, [tabIndex, scopeUserId, page, pageSize]);

  //-------------------API Handlers------------------

  const listAllUserDocs = async () => {
    if (!user) return;
    const myDocsOnly = scopeUserId === "all" ? "false" : "true";
    const payload = {
      my_docs_only: myDocsOnly,
      page: page + 1,
      size: pageSize,
    };
    try {
      setLoading(true);
      const documents = await listDocuments(payload);
      setDocs(documents.items || []);
      setTotal(documents.total || 0);
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
      page: page + 1,
      size: pageSize,
    };
    try {
      setLoading(true);
      const response = await listDocumentsSuperadmin(payload);
      setDocs(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWebsites = async () => {
    const myDocsOnly = scopeUserId === "all" ? "false" : "true";
    try {
      setLoading(true);
      const response = await listWebsite({
        my_docs_only: myDocsOnly,
        page: page + 1,
        size: pageSize,
      });
      setWebsites(response?.items || []);
      setTotal(response?.total || 0);
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
      page: page + 1,
      size: pageSize,
    };
    try {
      setLoading(true);
      const response = await listWebsitesSuperadmin(payload);
      setWebsites(response.items || []);
      setTotal(response.total || 0);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWebsiteUpload = async (websiteUrl: string[]) => {
    const payload = {
      urls: websiteUrl,
    };
    try {
      setIsLoading(true);
      const resp = await uploadWebsite(payload);
      setWebsiteDialogOpen(false);
      if (resp.errors.length > 0) {
        showSnackbar("error", resp.errors[0].error);
      } else {
        showSnackbar("success", "Website scraped successfully");
      }
      if (isSuperAdmin) {
        listSuperadminWeb();
      } else {
        fetchWebsites();
      }
    } catch (e: any) {
      const message = e?.response.data.detail || "Something went wrong";
      showSnackbar("error", message);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletWebsite = async () => {
    try {
      setLoading(true);
      const resp = await deleteWebsite(selectedRow);
      setOpenDeleteDialog(false);
      setSelectedRow(null);
      setDeleteType("");
      showSnackbar("success", resp.message || "");
      if (isSuperAdmin) {
        listSuperadminWeb();
      } else {
        fetchWebsites();
      }
    } catch (error: any) {
      const message = error.response.data.detail || "Something went wrong";
      console.error(error);
      showSnackbar("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      setLoading(true);
      const resp = await deleteDocument(selectedRow);
      setOpenDeleteDialog(false);
      setSelectedRow(null);
      setDeleteType("");
      showSnackbar("success", resp.message || "Document deleted successfully");
      if (isSuperAdmin) {
        listAllSuperadminDocs();
      } else {
        listAllUserDocs();
      }
    } catch (error: any) {
      const message = error.response.data.detail || "Something went wrong";
      console.error(error);
      showSnackbar("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (row: any) => {
    try {
      let response;
      if (isSuperAdmin) {
        response = await downloadDocSuperadmin(row.id);
      } else {
        response = await downloadDocUser(row.id);
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
      showSnackbar("error", "Document file not found on server");
    }
  };

  //---------------Astion Handlers-------------------

  const onUploaded = () => {
    setTabIndex(0);
    if (isSuperAdmin) {
      listAllSuperadminDocs();
    } else {
      listAllUserDocs();
    }
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

  const refreshList = () => {
    if (isSuperAdmin) {
      if (tabIndex === 0) {
        listAllSuperadminDocs();
      } else if (tabIndex === 1) {
        listSuperadminWeb();
      }
    } else {
      if (tabIndex === 0) {
        listAllUserDocs();
      } else {
        fetchWebsites();
      }
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setPage(0);
  };

  const handleOpenWebLink = (row: any) => {
    if (!row || !row.url) return;
    window.open(row.url, "_blank", "noopener,noreferrer");
  };

  const handleRetryUpload = async (row: any) => {
    const id = row.id;
    const payload = {
      document_ids: [id],
    };
    try {
      const resp = await retryUploadDocs(payload);
      if (resp.retried_count > 0) {
        showSnackbar("success", "Attempting to re-upload the document.");
      }
      if (resp.skipped_count > 0) {
        showSnackbar("error", resp.skipped[0].reason);
      }
      refreshList();
      console.log(resp.skipped[0].reason);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRetryScrapeWeb = (row: any) => {
    handleWebsiteUpload([row.url]);
  };

  // -------------------- TABLE CONFIG --------------------

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
      field: "status",
      headerName: "Upload Status",
      renderCell: (params) => {
        const row = params.row.status;
        const errorMsg = params.row.error_message;
        return (
          <Box sx={{ display: "flex", mt: "5px" }}>
            <StatusCell status={row} errorReason={errorMsg} />
            {errorMsg && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleRetryUpload(params.row)}
                title="Retry Upload"
              >
                <RefreshIcon />
              </IconButton>
            )}
          </Box>
        );
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
            {/* <IconButton
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
            /> */}
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
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        const row = params.row.status;
        const errorMsg = params.row.error_message;
        return (
          <Box sx={{ display: "flex", mt: "5px" }}>
            <StatusCell status={row} errorReason={errorMsg} />
            {errorMsg && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleRetryScrapeWeb(params.row)}
                title="Retry Scraping"
              >
                <RefreshIcon />
              </IconButton>
            )}
          </Box>
        );
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
                {isSuperAdmin ? "Filter by Company" : "Filter by User"}
              </Typography>
              <Select
                value={scopeUserId || "all"}
                onChange={(e) => setScopeUserId(e.target.value as any)}
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 380, maxWidth: 200 } },
                }}
              >
                {isSuperAdmin && <MenuItem value="all">All</MenuItem>}
                {filterOptions?.map((item) => (
                  <MenuItem
                    sx={{ whiteSpace: "pre-wrap", borderBottom: '1px solid lightgrey' }}
                    key={item.value}
                    value={item.value}
                  >
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
          <IconButton
            size="small"
            color="primary"
            onClick={() => refreshList()}
            title="Refresh List"
          >
            <RefreshIcon />
          </IconButton>
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabIndex === 0 && (
            <CustomTable
              isLoading={loading}
              gridRows={docs}
              columns={columns}
              totalRows={total}
              page={page}
              pageSize={pageSize}
              onPageChange={(newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
              }}
            />
          )}
          {tabIndex === 1 && (
            <CustomTable
              isLoading={loading}
              gridRows={websites}
              columns={websiteColumns}
              totalRows={total}
              page={page}
              pageSize={pageSize}
              onPageChange={(newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
              }}
            />
          )}
        </Box>
      </Box>
      <UploadDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={onUploaded}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title={`${deleteType === "document" ? "File" : "Website"}`}
        content={`Are you sure you want to delete this ${deleteType}?`}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDelete}
        loading={loading}
      />
      {/* <PreviewDialog
        open={previewOpen}
        doc={previewDoc}
        onClose={() => setPreviewOpen(false)}
        isSuperadmin={isSuperAdmin}
      /> */}
      <WebsiteUploadDialog
        open={websiteDialogOpen}
        onClose={() => setWebsiteDialogOpen(false)}
        onSubmit={handleWebsiteUpload}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}
