import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { type User } from "../../store/mockData";
import UserDialog from "../../components/dialogs/UserDialog";
import CustomTable from "../../components/CustomTable";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import { useAuth } from "../../contexts/AuthContext";
import { createUser, listUsers } from "../../services/user.service";
import {
  createCompanyAdmin,
  getCompanyAdmins,
} from "../../services/company.service";
import { useSnackbar } from "../../contexts/SnackbarContext";

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

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (isSuperAdmin) {
      listAllAdminUsers();
    } else {
      refresh();
    }
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      const resp = await listUsers();
      console.log(resp);
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
      const response = await createUser(payload);
      setRows(response);
      showSnackbar("success", "User created successfully");
      setOpenDialog(false);
      refresh();
    } catch (error: any) {
      const message = error?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
      console.log(error);
    }
  };

  const handleCreateAdminUser = async (data: any) => {
    const tenantCode = data?.tenant_code;
    const payload = {
      ...data,
      user_code: tenantCode + "-" + data.user_code,
    };
    try {
      const response = await createCompanyAdmin(tenantCode, payload);
      setRows(response);
      showSnackbar("success", "User created successfully");
      setOpenDialog(false);
      listAllAdminUsers();
    } catch (error: any) {
      const message = error?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
      console.log(error);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  // const handleEdit = (row: User) => {
  //   setEditing(row);
  //   setOpenDialog(true);
  // };

  // const handleDelete = (row: User) => {
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
    if (editing) {
    } else {
      !isSuperAdmin ? handleCreateUser(data) : handleCreateAdminUser(data);
    }
    refresh();
  };

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
        field: "company_name",
        headerName: "Company",
        width: 180,
        // valueGetter: (params: any) => {
        //   return companyMap[params] || "-";
        // },
      },
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
      //     const row = params.row as User;
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
          <Typography variant="h6">Users</Typography>
          <Button
            variant="contained"
            onClick={handleAdd}
          >
            Add user
          </Button>
        </Box>
        <CustomTable isLoading={loading} gridRows={gridRows} columns={columns} />
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
