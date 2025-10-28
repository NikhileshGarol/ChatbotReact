import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Typography, Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getCompanies,
  type User,
} from "../../store/mockData";
import UserDialog from "../../components/dialogs/UserDialog";
import CustomTable from "../../components/CustomTable";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import { useAuth } from "../../contexts/AuthContext";
import { createUser, listUsers } from "../../services/user.service";

export default function UserList() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);

  useEffect(() => {
    setRows(getUsers());
    refresh();
  }, []);

  const refresh = async () => {
    try {
      const resp = await listUsers();
      console.log(resp);
      setRows(resp);
    } catch (error) {
      console.error(error);
    }
    // setRows(resp);
  };

  const handleAdd = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: User) => {
    setEditing(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: User) => {
    setToDelete(row);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteUser(toDelete.id);
    setDeleteConfirmOpen(false);
    setToDelete(null);
    refresh();
  };

  const handleSave = async (data: any) => {
    const payload = {
      ...data,
      user_code: data?.tenant_code + "-" + data.user_code,
    };

    if (editing) {
      updateUser(editing.id, data);
    } else {
      const resp = await createUser(payload);
      console.log("userCreate", resp);
    }
    refresh();
  };

  const companies = getCompanies();
  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c.name]));

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "display_name", headerName: "Name", width: 120 },
      { field: "email", headerName: "Email", width: 220 },
      { field: "contact_number", headerName: "Phone", width: 140 },
      {
        field: "role",
        headerName: "Role",
        width: 110,
        renderCell: (params: any) => {
          const value = params.row.role;
          return <span style={{ textTransform: "capitalize" }}>{value}</span>;
        },
      },
      {
        field: "address",
        headerName: "Company",
        width: 180,
        // valueGetter: (params: any) => {
        //   return companyMap[params] || "-";
        // },
      },
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
          const row = params.row as User;
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
    [companyMap]
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
          <Typography variant="h6">Users</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAdd}
          >
            Add user
          </Button>
        </Box>

        {/* <Paper sx={{ height: 520 }}> */}
        {/* <DataGrid rows={gridRows} columns={columns} pageSizeOptions={[5, 10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} /> */}
        <CustomTable gridRows={gridRows} columns={columns} />
        {/* </Paper> */}
      </Box>

      <UserDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        initial={editing}
      />

      <DeleteDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="User"
      />
    </AdminLayout>
  );
}
