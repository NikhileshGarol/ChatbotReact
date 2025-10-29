import { Box, Paper, Typography, Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import RHFTextField from "../../components/RHF/RHFTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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

  const onSubmit = async (data: {
    email: string;
    password: string;
    checked?: boolean | null;
  }) => {
    await userLogin(data.email, data.password, !!data.checked);
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
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper sx={{ width: 420, p: 4 }}>
        <Typography textAlign={"center"} variant="h5" gutterBottom>
          Sign in
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <RHFTextField name="email" label="Email" />
            <Box sx={{ height: 12 }} />
            <RHFTextField name="password" label="Password" type="password" />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "grey",
                  "&: hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
                variant="body2"
                onClick={() => navigate("/auth/forgot")}
              >
                Forgot Password?
              </Typography>
              <Button type="submit" variant="contained">
                Sign in
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
}
