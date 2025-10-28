import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  defaultValue?: any;
  title: string;
};

export default function RHFCheckboxField({ name, defaultValue, title }: Props) {
  const { control } = useFormContext();
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <>
          <Checkbox {...field} {...label} />
          <span>{title}</span>
        </>
      )}
    />
  );
}
