import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { type Company } from "../../store/mockData";
import CompanyDialog from "../../components/dialogs/CompanyDialog";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import CustomTable from "../../components/CustomTable";
import { createCompany, listCompanies } from "../../services/company.service";
import type { CompanyCreatePayload, CompanyOut } from "../../services/types";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useEffectOnce } from "../../hooks/useEffectOnce";

export default function CompanyList() {
  const [rows, setRows] = useState<CompanyOut[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
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
      console.log(error);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  // const handleEdit = (row: Company) => {
  //   setEditing(row);
  //   setOpenDialog(true);
  // };

  // const handleDelete = (row: Company) => {
  //   setToDelete(row);
  //   setDeleteConfirmOpen(true);
  // };

  const confirmDelete = () => {
    if (!toDelete) return;
    setDeleteConfirmOpen(false);
    setToDelete(null);
    refresh();
  };

  const handleSave = (data: any) => {
    console.log(data);
    if (editing) {
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
      { field: "slug_url", headerName: "URL", width: 120 },
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
      // {
      //   field: "actions",
      //   headerName: "Actions",
      //   width: 140,
      //   sortable: false,
      //   renderCell: (params) => {
      //     const row = params.row as Company;
      //     return (
      //       <>
      //         <IconButton size="small" onClick={() => handleEdit(row)}>
      //           <EditIcon fontSize="small" />
      //         </IconButton>
      //         <IconButton size="small" onClick={() => handleDelete(row)}>
      //           <DeleteIcon fontSize="small" />
      //         </IconButton>
      //       </>
      //     );
      //   },
      // },
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
          <Button
            variant="contained"
            onClick={handleAdd}
          >
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
        onConfirm={confirmDelete}
        title="Company"
      />
    </AdminLayout>
  );
}
