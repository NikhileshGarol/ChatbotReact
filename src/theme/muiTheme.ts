import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // primary: { main: "#4191ecff" },
    // secondary: { main: "#0b9d74" },

    primary: { main: "#082757" },
    secondary: { main: "#1f3b62" },
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
          "&.Mui-error": {
            color: "#D32F2F",
          },
        },
        contained: {
          marginLeft: 0, // keep aligned with input
        },
        // error: {
        //   color: "#D32F2F", // your custom default error color
        //   fontWeight: 600,
        // },
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
          borderRadius: 8,
          minWidth: 400,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            // backgroundColor: "#124d5eff",
            backgroundColor: "#082757",

            color: "#fff",
          },
          "&.Mui-selected:hover": {
            // backgroundColor: "rgba(72, 113, 153, 1)",
            backgroundColor: "#1f3b62",
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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
        },
      },
    },
  },
});

export default theme;
