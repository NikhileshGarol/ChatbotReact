import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {
  name: string;
  label?: string;
  defaultValue?: any;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
};

export default function RHFPasswordField({
  name,
  label,
  defaultValue = "",
  disabled = false,
  placeholder = "",
  required = true,
}: Props) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <>
          {label && (
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {label} {required && <span style={{ color: "#D32F2F" }}>*</span>}
            </Typography>
          )}
          <TextField
            {...field}
            type={showPassword ? "text" : "password"}
            fullWidth
            disabled={disabled}
            placeholder={placeholder}
            margin="normal"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleVisibility}
                    edge="end"
                    size="small"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              p: 0,
              m: 0,
              bgcolor: "none",
              "& .MuiInputBase-root": {
                height: 40,
                // 🔒 Remove browser’s default reveal buttons (Edge/Safari)
                "& input::-ms-reveal, & input::-ms-clear": {
                  display: "none",
                  width: 0,
                  height: 0,
                },
                "& input::-webkit-credentials-auto-fill-button": {
                  visibility: "hidden",
                  display: "none !important",
                },
                "& input::-webkit-textfield-decoration-container": {
                  display: "none !important",
                },
                "& input::-webkit-password-toggle": {
                  display: "none !important",
                },
                // Chrome autofill styling fix
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px transparent inset",
                  WebkitTextFillColor: "inherit",
                  transition: "background-color 9999s ease-in-out 0s",
                },
              },
            }}
          />
        </>
      )}
    />
  );
}
