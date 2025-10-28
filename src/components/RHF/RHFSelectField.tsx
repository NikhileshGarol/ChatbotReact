import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  defaultValue: any;
};

export default function RHFSelectField({
  name,
  label,
  options,
  defaultValue,
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <>
          <Typography variant="subtitle2">
            {label} <span style={{ color: "#D32F2F" }}>*</span>
          </Typography>
          <FormControl error={!!fieldState.error} fullWidth>
            <Select {...field}>
              {options?.map((options) => (
                <MenuItem key={options.value} value={options.value}>
                  {options.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {fieldState.error && (
            <Typography variant="caption" color="error">
              {fieldState.error.message}
            </Typography>
          )}
        </>
      )}
    />
  );
}
