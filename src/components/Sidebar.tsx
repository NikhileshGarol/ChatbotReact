import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

type Props = {
  open: boolean;
  drawerWidth: number;
  role: "admin" | "user" | "superadmin";
};

export default function Sidebar({ open, drawerWidth, role }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Role-based items
  const baseNavItems = [
    // { label: "Dashboard", icon: <HomeIcon />, path: "/admin" },
    {
      label: "Companies",
      icon: <BusinessIcon />,
      path: "/admin/companies",
    },
    { label: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { label: "Upload", icon: <CloudUploadIcon />, path: "/upload" },
  ];

  const adminNavItems = [
    // { label: "Dashboard", icon: <HomeIcon />, path: "/admin" },
    { label: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { label: "Upload", icon: <CloudUploadIcon />, path: "/upload" },
  ];

  const userNavItems = [
    { label: "Upload", icon: <CloudUploadIcon />, path: "/upload" },
  ];

  const navItems =
    role && role === "admin"
      ? adminNavItems
      : role === "superadmin"
      ? baseNavItems
      : userNavItems;

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          width: open ? drawerWidth : 72,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          whiteSpace: "nowrap",
          overflowX: "hidden",
        },
      }}
    >
      {/* <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 2, mt:10 }}>
        <img src="/logo192.png" alt="logo" style={{ width: 36, height: 36, borderRadius: 6 }} />
        {open && <Box sx={{ ml: 2, fontWeight: 600 }}>Company</Box>}
      </Box>
      <Divider /> */}
      <List sx={{ mt: "64px" }}>
        {navItems.map((it) => (
          <ListItemButton
            key={it.path}
            selected={location.pathname === it.path}
            sx={{ py: 1.25 }}
            onClick={() => navigate(it.path)}
          >
            <ListItemIcon>{it.icon}</ListItemIcon>
            {open && <ListItemText primary={it.label} />}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
