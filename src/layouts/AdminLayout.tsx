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
import FloatingChat from "../components/FloatingChat";
import Logo from "../assets/Stixis-logo-golden.png";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 200;
const collapsedWidth = 72;

export default function AdminLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "superadmin";
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(true);

  // const roleLabel =
  //   user?.role === "superadmin"
  //     ? "Super Admin"
  //     : user?.role === "admin"
  //     ? "Company Admin"
  //     : "User";

  // Auto collapse drawer on md or smaller screens
  const drawerOpen = isMdDown ? false : open;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background: "linear-gradient(90deg, #124d5eff 0%, #0b76ef 100%)",
        }}
      >
        <Toolbar>
          <Box sx={{ width: "170px" }}>
            <img src={Logo} alt="Logo" id="logo"></img>
          </Box>
          {!open && <ChevronLeftIcon />}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ml: open ? 2 : -1}}
            onClick={() => setOpen((s) => !s)}
          >
            <MenuIcon />
            {open && <ChevronRightIcon />}
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ textTransform: "uppercase", fontWeight: 700 }}
              variant="h6"
            >
              AI Asstistant Solutions
            </Typography>
          </Box>
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
        {isAuthenticated && !isAdmin && <FloatingChat />}
      </Box>
    </Box>
  );
}
