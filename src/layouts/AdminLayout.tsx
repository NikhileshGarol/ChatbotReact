import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 200;
const collapsedWidth = 72;

export default function AdminLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(true);
  const { user } = useAuth();

  const roleLabel =
    user?.role === "superadmin"
      ? "Super Admin"
      : user?.role === "admin"
      ? "Company Admin"
      : "User";

  // Auto collapse drawer on md or smaller screens
  const drawerOpen = isMdDown ? false : open;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="primary"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            onClick={() => setOpen((s) => !s)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {roleLabel} - {user?.display_name}
          </Typography>
          <Header />
        </Toolbar>
      </AppBar>

      <Sidebar
        open={drawerOpen}
        drawerWidth={drawerWidth}
        role={user?.role ?? "user"}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerOpen ? drawerWidth : collapsedWidth}px)`,
          marginLeft: `${drawerOpen ? drawerWidth : collapsedWidth}px`,
          transition: "width 0.3s, margin-left 0.3s",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
