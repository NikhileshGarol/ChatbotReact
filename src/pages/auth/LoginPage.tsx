import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import RHFTextField from "../../components/RHF/RHFTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const schema = yup
  .object({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
    checked: yup.boolean().notRequired(),
  })
  .required();

export default function LoginPage() {
  const methods = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit } = methods;
  const { user, userLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: {
    email: string;
    password: string;
    checked?: boolean | null;
  }) => {
    try {
      setLoading(true);
      await userLogin(data.email, data.password, !!data.checked);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Redirect logged-in users
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/users", { replace: true });
      } else if (user.role === "superadmin") {
        navigate("/admin/companies", { replace: true });
      } else {
        navigate("/upload", { replace: true });
      }
    }
  }, [user]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #343537ff 0%, #4f7abfff 100%)",
        position: "relative",
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: { xs: "95%", sm: 700 },
          p: 0,
          borderRadius: 3,
          boxShadow: 6,
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
        elevation={4}
      >
        <Grid spacing={2} container>
          {/* Logo or Image on right */}
          <Grid
            size={{ xs: 12, sm: 5 }}
            sx={{
              background: "linear-gradient(135deg, #e0e7ff 0%, #fff 70%)",
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              py: 4,
            }}
          >
            <Box
              sx={{
                height: 120,
                width: 120,
                background:
                  "url('https://cdn-icons-png.flaticon.com/512/4712/4712107.png') center/contain no-repeat",
                mx: "auto",
              }}
            />
          </Grid>
          {/* Login Form on right */}
          <Grid
            size={{ xs: 12, sm: 7 }}
            sx={{
              p: { xs: 3, sm: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              textAlign="center"
              gutterBottom
              fontWeight="bold"
              color="text.primary"
              sx={{ mb: 2 }}
            >
              Welcome
            </Typography>

            <Typography
              variant="subtitle1"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Sign in to continue
            </Typography>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <RHFTextField name="email" label="Email" type="email" />
                <RHFTextField
                  name="password"
                  label="Password"
                  type="password"
                />

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "primary.main",
                      },
                    }}
                    onClick={() => navigate("/auth/forgot")}
                  >
                    Forgot Password?
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Box>
              </form>
            </FormProvider>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
