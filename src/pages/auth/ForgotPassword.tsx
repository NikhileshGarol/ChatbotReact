import { Box, Paper, Typography, Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import RHFTextField from "../../components/RHF/RHFTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  requestResetPassword,
  resetPassword,
} from "../../services/auth.service";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const schema = yup
  .object({
    email: yup
      .string()
      .matches(emailRegex, "Invalid email format")
      .required("Email is required"),
  })
  .required();

export default function ForgotPassword() {
  const methods = useForm({ resolver: yupResolver(schema) });
  const methodsNewPass = useForm({
    resolver: yupResolver(
      yup.object({
        password: yup
          .string()
          .min(6, "At least 6 characters")
          .required("Password is required"),
        confirm_password: yup
          .string()
          .oneOf([yup.ref("password"), ""], "Passwords must match")
          .required("Confirm your password"),
      })
    ),
  });
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [resetToken, setResetToken] = useState<string>("");

  const onSubmitRequest = async (data: any) => {
    try {
      const response = await requestResetPassword({ email: data.email });
      showSnackbar("success", response?.msg || "Reset link sent to your email");
      setResetToken(response.reset_token); // get token from response
      setStep("reset");
    } catch (err: any) {
      console.log(err);
      const message = err?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
    }
  };

  const onSubmitReset = async (data: any) => {
    const payload = {
      new_password: data.password,
    };
    try {
      // Call API to update password with token and new password
      const response = await resetPassword(payload, { token: resetToken });
      showSnackbar(
        "success",
        response?.msg || "Password updated successfully. You may login now."
      );
      setStep("request"); // or redirect to login
      navigate("/");
    } catch (err: any) {
      console.log(err);
      const message = err?.response?.data?.detail || "something went wrong";
      showSnackbar("error", message);
    }
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
          Forgot Password
        </Typography>

        {step === "request" && (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitRequest)} noValidate>
              <RHFTextField name="email" label="Email" />
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Send reset link
                </Button>
              </Box>
            </form>
          </FormProvider>
        )}

        {step === "reset" && (
          <FormProvider {...methodsNewPass}>
            <form
              onSubmit={methodsNewPass.handleSubmit(onSubmitReset)}
              noValidate
            >
              <RHFTextField
                type="password"
                name="password"
                label="New Password"
              />
              <RHFTextField
                type="password"
                name="confirm_password"
                label="Confirm Password"
              />
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Update Password
                </Button>
              </Box>
            </form>
          </FormProvider>
        )}
      </Paper>
    </Box>
  );
}
