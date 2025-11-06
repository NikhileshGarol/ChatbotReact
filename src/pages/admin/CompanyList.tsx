import { useEffect, useMemo, useState } from "react";
import { Typography, Box, Button, IconButton, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { type Company } from "../../store/mockData";
import type { CompanyCreatePayload, CompanyOut } from "../../services/types";
import { useSnackbar } from "../../contexts/SnackbarContext";
import {
  createCompany,
  deleteCompanyDetails,
  listCompanies,
  updateCompanyDetails,
} from "../../services/company.service";
import AdminLayout from "../../layouts/AdminLayout";
import CompanyDialog from "../../components/dialogs/CompanyDialog";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import CustomTable from "../../components/CustomTable";
import WidgetConfigDialog from "../../components/dialogs/WidgetConfigDialog";
import CompanyChatDialog from "../../components/dialogs/CompanyChatDialog";

export default function CompanyList() {
  const { showSnackbar } = useSnackbar();

  const [rows, setRows] = useState<CompanyOut[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Company | null>(null);

  const [widgetConfigOpen, setWidgetConfigOpen] = useState(false);
  const [companyChatOpen, setCompanyChatOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyOut | null>(
    null
  );

  //-------------Handle SideEffects-----------------

  useEffect(() => {
    fetchCompanies();
  }, [page, pageSize]);

  // -------------------- API HANDLERS --------------------

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await listCompanies({
        page: page + 1,
        size: pageSize,
      });
      setRows(response?.items);
      setTotal(response?.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async (data: CompanyCreatePayload) => {
    try {
      setLoading(true);
      await createCompany(data);
      fetchCompanies();
      setOpenDialog(false);
      showSnackbar("success", "Company created successfully");
      resetPageOptions();
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompanyDetails = async (data: any) => {
    const tenantCode = data.tenant_code;
    try {
      setLoading(true);
      await updateCompanyDetails(tenantCode, data);
      fetchCompanies();
      setOpenDialog(false);
      showSnackbar("success", "Company details updated successfully");
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (data: any) => {
    try {
      setLoading(true);
      await deleteCompanyDetails(data.tenant_code);
      setDeleteConfirmOpen(false);
      setToDelete(null);
      fetchCompanies();
      showSnackbar("success", "Company details updated successfully");
      resetPageOptions();
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (error: any) => {
    const message =
      error?.response?.data?.detail || error?.message || "Something went wrong";
    showSnackbar("error", message);
  };

  const resetPageOptions = () => {
    setPage(0);
  };

  // -------------------- ACTION HANDLERS --------------------

  const handleAdd = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: Company) => {
    setEditing(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Company) => {
    setToDelete(row);
    setDeleteConfirmOpen(true);
  };

  const handleOpenWidgetConfig = (company: any) => {
    setSelectedCompany(company);
    setWidgetConfigOpen(true);
  };

  const handleOpenCompanyChat = (company: any) => {
    setSelectedCompany(company);
    setCompanyChatOpen(true);
  };

  const confirmDelete = (data: any) => {
    if (!toDelete) return;
    handleDeleteCompany(data);
  };

  const handleSave = (data: any) => {
    console.log(data);
    if (editing) {
      handleUpdateCompanyDetails(data);
    } else {
      handleAddCompany(data as any);
    }
  };

  // -------------------- TABLE CONFIG --------------------

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Name" },
      { field: "email", headerName: "Email" },
      { field: "phone", headerName: "Phone", width: 100 },
      { field: "website", headerName: "Website" },
      { field: "city", headerName: "City", width: 120 },
      { field: "address", headerName: "Address" },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        width: 153,
        renderCell: (params) => {
          const row = params.row as Company;
          return (
            <Box sx={{ display: "flex", mt: "5px" }}>
              <IconButton
                size="small"
                onClick={() => handleOpenWidgetConfig(row)}
                title="Widget Configuration"
                color="primary"
              >
                <WidgetsIcon fontSize="small" />
              </IconButton>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: "2px", mt: 1, borderColor: "grey.300" }}
              />
              <IconButton
                size="small"
                onClick={() => handleOpenCompanyChat(row)}
                title="Chat with Company Data"
                color="primary"
              >
                <ChatIcon fontSize="small" />
              </IconButton>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: "2px", mt: 1, borderColor: "grey.300" }}
              />
              <IconButton
                size="small"
                title="Edit Company data"
                color="primary"
                onClick={() => handleEdit(row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: "2px", mt: 1, borderColor: "grey.300" }}
              />
              <IconButton
                title="Delete Company data"
                color="primary"
                size="small"
                onClick={() => handleDelete(row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        },
      },
    ],
    []
  );

  const gridRows: GridRowsProp = rows.map((r: any) => ({ id: r.id, ...r }));

  // -------------------- RENDER --------------------

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
          <Typography variant="h6">Companies</Typography>
          <Button variant="contained" onClick={handleAdd}>
            Add company
          </Button>
        </Box>

        <CustomTable
          isLoading={loading}
          gridRows={gridRows}
          columns={columns}
          totalRows={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          }}
        />
      </Box>

      <CompanyDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        initial={editing}
        loading={loading}
      />
      <DeleteDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={(data) => confirmDelete(data)}
        title="Company"
        content="Deleting Compay will delete all the associated users as well!"
        data={toDelete}
        loading={loading}
      />
      {selectedCompany && (
        <>
          <WidgetConfigDialog
            open={widgetConfigOpen}
            onClose={() => {
              setWidgetConfigOpen(false);
              setSelectedCompany(null);
            }}
            tenantCode={selectedCompany.tenant_code}
            companyName={selectedCompany.name}
          />
          <CompanyChatDialog
            open={companyChatOpen}
            onClose={() => {
              setCompanyChatOpen(false);
              setSelectedCompany(null);
            }}
            tenantCode={selectedCompany.tenant_code}
            companyName={selectedCompany.name}
          />
        </>
      )}
    </AdminLayout>
  );
}
