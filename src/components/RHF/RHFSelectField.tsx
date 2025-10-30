import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  defaultValue?: any;
  placeholder?: string;
};

export default function RHFSelectField({
  name,
  label,
  options,
  defaultValue,
  placeholder,
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
            <Select
              {...field}
              value={field.value || ""}
              displayEmpty
              MenuProps={{
                PaperProps: { sx: { maxHeight: 180, maxWidth: 150 } },
              }}
            >
              <MenuItem disabled value={""}>
                <Typography color="grey">{placeholder}</Typography>
              </MenuItem>
              {options?.map((options) => (
                <MenuItem
                  sx={{
                    px: 2,
                    borderBottom: "1px solid lightgrey",
                  }}
                  key={options.value}
                  value={options.value}
                >
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
