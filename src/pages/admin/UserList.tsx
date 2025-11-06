import { useEffect, useMemo, useRef, useState } from "react";
import { Typography, Box, Button, IconButton, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { type User } from "../../store/mockData";
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
import AdminLayout from "../../layouts/AdminLayout";
import UserDialog from "../../components/dialogs/UserDialog";
import CustomTable from "../../components/CustomTable";
import DeleteDialog from "../../components/dialogs/DeleteDialog";

export default function UserList() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);

  const isSuperAdmin = user?.role === "superadmin";

  //----------------Handle SideEffects------------

  useEffect(() => {
    if (isSuperAdmin) {
      listAllAdminUsers();
    } else {
      listAllUsers();
    }
  }, [page, pageSize]);

  //--------------API HANDLERS---------------

  const listAllUsers = async () => {
    const payload = {
      include_inactive: false,
      page: page + 1,
      size: pageSize,
    };
    try {
      setLoading(true);
      const resp = await listUsers(payload);
      setRows(resp.items || []);
      setTotal(resp.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const listAllAdminUsers = async () => {
    const payload = {
      page: page + 1,
      size: pageSize,
    };
    try {
      setLoading(true);
      const resp = await getCompanyAdmins(payload);
      setRows(resp?.items || []);
      setTotal(resp?.total || 0);
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
      await createUser(payload);
      showSnackbar("success", "User created successfully");
      setOpenDialog(false);
      listAllUsers();
      setPage(0);
    } catch (error: any) {
      handleApiError(error);
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
      await createCompanyAdmin(tenantCode, payload);
      showSnackbar("success", "User created successfully");
      setOpenDialog(false);
      listAllAdminUsers();
      setPage(0);
    } catch (error: any) {
      handleApiError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (data: any) => {
    try {
      setLoading(true);
      await updateUserById(data.id, data);
      showSnackbar("success", "User details update successfully");
      setOpenDialog(false);
      listAllUsers();
    } catch (error: any) {
      handleApiError(error);
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
      handleApiError(error);
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
      listAllUsers();
    } catch (error: any) {
      handleApiError(error);
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

  // -------------------- ACTION HANDLERS --------------------

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
    console.log(data);
    if (editing) {
      return isSuperAdmin ? handleUpdateAdmin(data) : handleUpdateUser(data);
    }

    return isSuperAdmin ? handleCreateAdminUser(data) : handleCreateUser(data);
  };

  // -------------------- TABLE CONFIG --------------------

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
      { field: "email", headerName: "Email", width: 140 },
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
        width: 90,
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
          <Typography variant="h6">Users</Typography>
          <Button variant="contained" onClick={handleAdd}>
            Add user
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
        loading={loading}
      />
    </AdminLayout>
  );
}
