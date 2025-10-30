import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Typography, Box, Button, IconButton, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { type Company } from "../../store/mockData";
import CompanyDialog from "../../components/dialogs/CompanyDialog";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import CustomTable from "../../components/CustomTable";
import {
  createCompany,
  deleteCompanyDetails,
  listCompanies,
  updateCompanyDetails,
} from "../../services/company.service";
import type { CompanyCreatePayload, CompanyOut } from "../../services/types";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useEffectOnce } from "../../hooks/useEffectOnce";
import WidgetConfigDialog from "../../components/dialogs/WidgetConfigDialog";
import CompanyChatDialog from "../../components/dialogs/CompanyChatDialog";

export default function CompanyList() {
  const [rows, setRows] = useState<CompanyOut[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [widgetConfigOpen, setWidgetConfigOpen] = useState(false);
  const [companyChatOpen, setCompanyChatOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyOut | null>(
    null
  );
  const { showSnackbar } = useSnackbar();

  useEffectOnce(() => {
    refresh();
  });

  const refresh = async () => {
    try {
      setLoading(true);
      const response = await listCompanies();
      setRows(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async (data: CompanyCreatePayload) => {
    try {
      await createCompany(data);
      refresh();
      setOpenDialog(false);
      showSnackbar("success", "Company created successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Something went wrong";
      showSnackbar("error", message);
    }
  };

  const handleUpdateCompanyDetails = async (data: any) => {
    const tenantCode = data.tenant_code;
    try {
      const response = await updateCompanyDetails(tenantCode, data);
      refresh();
      setOpenDialog(false);
      showSnackbar("success", "Company details updated successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Something went wrong";
      showSnackbar("error", message);
    }
  };

  const handleDeleteCompany = async (data: any) => {
    try {
      await deleteCompanyDetails(data.tenant_code);
      setDeleteConfirmOpen(false);
      setToDelete(null);
      refresh();
      showSnackbar("success", "Company details updated successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Something went wrong";
      showSnackbar("error", message);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  const handleOpenWidgetConfig = (company: any) => {
    setSelectedCompany(company);
    setWidgetConfigOpen(true);
  };

  const handleOpenCompanyChat = (company: any) => {
    setSelectedCompany(company);
    setCompanyChatOpen(true);
  };

  const handleEdit = (row: Company) => {
    setEditing(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Company) => {
    setToDelete(row);
    setDeleteConfirmOpen(true);
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

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Name", width: 150 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone", headerName: "Phone", width: 150 },
      { field: "address", headerName: "Address", flex: 1 },
      // { field: "slug_url", headerName: "URL", width: 120 },
      // {
      //   field: "status",
      //   headerName: "Status",
      //   width: 110,
      //   renderCell: (params: any) => {
      //     const isActive = params.row.status === "active" ? true : false;
      //     return (
      //       <span style={{ color: isActive ? "green" : "red" }}>
      //         {isActive ? "Active" : "InActive"}
      //       </span>
      //     );
      //   },
      // },
      {
        field: "actions",
        headerName: "Actions",
        width: 140,
        sortable: false,
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
        />
      </Box>

      <CompanyDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        initial={editing}
      />
      <DeleteDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={(data) => confirmDelete(data)}
        title="Company"
        content="Deleting Compay will delete all the associated users as well!"
        data={toDelete}
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
