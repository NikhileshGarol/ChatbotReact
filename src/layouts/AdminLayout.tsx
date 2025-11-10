import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import FloatingChat from "../components/FloatingChat";
import Logo from "../assets/Stixis-logo-golden.png";

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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    if (isMdDown) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const drawerContent = (
    <Sidebar
      open={!isMdDown ? open : true}
      drawerWidth={drawerWidth}
      role={user?.role ?? "user"}
    />
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* ===== Top App Bar ===== */}
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box
            sx={{
              width: { xs: "120px", sm: "150px", md: "170px" },
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>

          {/* Menu Toggle */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ ml: 1, display: { xs: "inline-flex", md: "inline-flex" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
            {!isMdDown && (open ? <ChevronRightIcon /> : <ChevronLeftIcon />)}
          </IconButton>

          {/* Page Title */}
          {!isMdDown && (
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
                AI Assistant Solutions
              </Typography>
            </Box>
          )}

          {/* Header Right Section */}
          <Header />
        </Toolbar>
      </AppBar>

      {/* ===== Sidebar / Drawer ===== */}
      {/* Desktop Drawer */}
      {!isMdDown && drawerContent}

      {/* Mobile Drawer */}
      {isMdDown && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // better performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* ===== Main Content ===== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          width: {
            xs: "100%",
            md: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
          },
          marginLeft: {
            xs: 0,
            md: `${open ? drawerWidth : collapsedWidth}px`,
          },
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
