import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  defaultValue?: string | "active" | "inactive";
};

export default function RHFSwitchField({
  name,
  label,
  defaultValue = "active",
}: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <>
          <Typography variant="subtitle2">
            {label} <span style={{ color: "#D32F2F" }}>*</span>
          </Typography>
          <FormGroup sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  {...field}
                  size="small"
                  checked={field.value === "active"}
                  onChange={(e) =>
                    field.onChange(e.target.checked ? "active" : "inactive")
                  }
                />
              }
              label={field.value === "active" ? "Active" : "InActive"}
            />
          </FormGroup>
        </>
      )}
    />
  );
}
