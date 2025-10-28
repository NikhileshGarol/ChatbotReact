import { Box, Paper, Typography, Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import RHFTextField from "../../components/RHF/RHFTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
  })
  .required();

export default function ForgotPassword() {
  const methods = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    // mock success response
    alert(`If the email exists, a reset link has been sent.${data.email}`);
  };

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
        <Typography variant="h6" gutterBottom>
          Forgot password
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <RHFTextField name="email" label="Email" />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained">
                Send reset link
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
}
