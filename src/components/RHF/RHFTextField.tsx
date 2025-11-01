import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

type Props = {
  name: string;
  label?: string;
  type?: string;
  defaultValue?: any;
  disabled?: boolean;
  placeholder?: string;
};

export default function RHFTextField({
  name,
  label,
  type = "text",
  defaultValue = "",
  disabled = false,
  placeholder = "",
}: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <>
          <Typography sx={{color: 'grey'}} variant="subtitle2">
            {label} <span style={{ color: "#D32F2F" }}>*</span>
          </Typography>
          <TextField
            {...field}
            type={type}
            fullWidth
            disabled={disabled}
            placeholder={placeholder}
            margin="normal"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            sx={{
              p: 0,
              m: 0,
              bgcolor: "none",
              "& .MuiInputBase-root": {
                height: 40,
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
