import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0b76ef" },
    secondary: { main: "#0b9d74" },
    background: { default: "#f4f6f8" },
    error: { main: "#D32F2F" },
  },
  typography: { fontFamily: "Inter, Roboto, Arial" },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "12px",
          marginLeft: 0,
          textTransform: "none",
        },
        contained: {
          marginLeft: 0, // keep aligned with input
        },
        error: {
          color: "#D32F2F", // your custom default error color
          fontWeight: 600,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 40,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          minWidth: 400,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#1976d2",
            color: "#fff",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#115293",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit !important", // Inherit the selected color (white)
          minWidth: 36,
        },
      },
    },
  },
});

export default theme;
