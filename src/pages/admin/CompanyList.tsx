import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Typography, Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  type Company,
} from "../../store/mockData";
import CompanyDialog from "../../components/dialogs/CompanyDialog";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import CustomTable from "../../components/CustomTable";

export default function CompanyList() {
  const [rows, setRows] = useState<Company[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Company | null>(null);

  useEffect(() => {
    setRows(getCompanies());
  }, []);

  const refresh = () => setRows(getCompanies());

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

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteCompany(toDelete.id);
    setDeleteConfirmOpen(false);
    setToDelete(null);
    refresh();
  };

  const handleSave = (data: any) => {
    if (editing) {
      updateCompany(editing.id, data);
    } else {
      addCompany(data as any);
    }
    refresh();
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Name", width: 150 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone", headerName: "Phone", width: 150 },
      { field: "website", headerName: "Website", flex: 1 },
      { field: "url", headerName: "URL", width: 120 },
      {
        field: "status",
        headerName: "Status",
        width: 110,
        renderCell: (params: any) => {
          const isActive = params.row.status === "active" ? true : false;
          return (
            <span style={{ color: isActive ? "green" : "red" }}>
              {isActive ? "Active" : "InActive"}
            </span>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 140,
        sortable: false,
        renderCell: (params) => {
          const row = params.row as Company;
          return (
            <>
              <IconButton size="small" onClick={() => handleEdit(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(row)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
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
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAdd}
          >
            Add company
          </Button>
        </Box>

        <CustomTable gridRows={gridRows} columns={columns} />
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
