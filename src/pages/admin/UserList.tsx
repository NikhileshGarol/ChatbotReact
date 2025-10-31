import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Typography, Box, Button, IconButton, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { type User } from "../../store/mockData";
import UserDialog from "../../components/dialogs/UserDialog";
import CustomTable from "../../components/CustomTable";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import { useAuth } from "../../contexts/AuthContext";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUserById,
} from "../../services/user.service";
import {
  createCompanyAdmin,
  deleteCompanyAdmin,
  getCompanyAdmins,
  updateAdmin,
} from "../../services/company.service";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useEffectOnce } from "../../hooks/useEffectOnce";

export default function UserList() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [rows, setRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const isSuperAdmin = user?.role === "superadmin";
  const calledRef = useRef(false);

  useEffectOnce(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (isSuperAdmin) {
      listAllAdminUsers();
    } else {
      refresh();
    }
  });

  const refresh = async () => {
    try {
      setLoading(true);
      const resp = await listUsers();
      setRows(resp);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const listAllAdminUsers = async () => {
    try {
      setLoading(true);
      const resp = await getCompanyAdmins();
      setRows(resp);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: any) => {
    const tenantCode = data?.tenant_code;
    const payload = {
      ...data,
      user_code: tenantCode + "-" + data.user_code,
    };
    try {
      setLoading(true);
      const response = await createUser(payload);
      // setRows(response);
      showSnackbar("success", "User created successfully");
      setOpenDialog(false);
      refresh();
    } catch (error: any) {
      const message = error?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdminUser = async (data: any) => {
    const tenantCode = data?.tenant_code;
    const payload = {
      ...data,
      user_code: tenantCode + "-" + data.user_code,
    };
    try {
      setLoading(true);
      const response = await createCompanyAdmin(tenantCode, payload);
      setRows(response);
      showSnackbar("success", "User created successfully");
      setOpenDialog(false);
      listAllAdminUsers();
    } catch (error: any) {
      const message = error?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
      console.log(error);
    } finally {
      setLoading(true);
    }
  };

  const handleUpdateUser = async (data: any) => {
    try {
      setLoading(true);
      await updateUserById(data.id, data);
      showSnackbar("success", "User details update successfully");
      setOpenDialog(false);
      refresh();
    } catch (error: any) {
      const message = error?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdmin = async (data: any) => {
    try {
      setLoading(true);
      await updateAdmin(data.id, data);
      showSnackbar("success", "Admin details update successfully");
      setOpenDialog(false);
      listAllAdminUsers();
    } catch (error: any) {
      const message = error?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUserById = async (data: any) => {
    try {
      setLoading(true);
      await deleteUser(data.id);
      showSnackbar("success", "User deleted successfully");
      setDeleteConfirmOpen(false);
      setToDelete(null);
      refresh();
    } catch (error: any) {
      const message = error?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdminById = async (data: any) => {
    try {
      setLoading(true);
      await deleteCompanyAdmin(data.id);
      showSnackbar("success", "Admin deleted successfully");
      setDeleteConfirmOpen(false);
      setToDelete(null);
      listAllAdminUsers();
    } catch (error: any) {
      const message = error?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
    } finally {
      setLoading(false);
    }
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

  const confirmDelete = (data: any) => {
    if (!toDelete) return;
    if (isSuperAdmin) {
      handleDeleteAdminById(data);
    } else {
      handleDeleteUserById(data);
    }
  };

  const handleSave = (data: any) => {
    if (editing) {
      if (isSuperAdmin) {
        handleUpdateAdmin(data);
      } else {
        handleUpdateUser(data);
      }
    } else {
      !isSuperAdmin ? handleCreateUser(data) : handleCreateAdminUser(data);
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        renderCell: (params) => {
          const fullname = params.row.firstname + " " + params.row.lastname;
          return <span>{fullname}</span>;
        },
      },
      { field: "email", headerName: "Email" },
      { field: "contact_number", headerName: "Phone", width: 100 },
      {
        field: "role",
        headerName: "Role",
        width: 100,
        renderCell: (params: any) => {
          const value = params.row.role;
          return <span style={{ textTransform: "capitalize" }}>{value}</span>;
        },
      },
      {
        field: "company_name",
        headerName: "Company",
        width: 122,
      },
      { field: "city", headerName: "City" },
      { field: "address", headerName: "Address" },
      {
        field: "actions",
        headerName: "Actions",
        width: 100,
        sortable: false,
        renderCell: (params) => {
          const row = params.row;
          return (
            <Box sx={{ display: "flex", mt: "5px" }}>
              <IconButton
                title="Edit User details"
                color="primary"
                size="small"
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
                title="Delete User"
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

  const gridRows: GridRowsProp = Array.isArray(rows)
    ? rows.map((r) => ({ id: r.id, ...r }))
    : [];

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
          <Typography variant="h6">
            {isSuperAdmin ? "Admins" : "Users"}
          </Typography>
          <Button variant="contained" onClick={handleAdd}>
            Add {isSuperAdmin ? "admin" : "user"}
          </Button>
        </Box>
        <CustomTable
          isLoading={loading}
          gridRows={gridRows}
          columns={columns}
        />
      </Box>

      <UserDialog
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
        data={toDelete}
        title={isSuperAdmin ? "Admin" : "User"}
      />
    </AdminLayout>
  );
}
