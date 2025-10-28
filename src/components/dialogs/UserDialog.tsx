import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFTextField from "../RHF/RHFTextField";
import { userSchema } from "../../validation/userSchema";
import { getCompanies } from "../../store/mockData";
import { GridCloseIcon } from "@mui/x-data-grid";
import RHFSelectField from "../RHF/RHFSelectField";
import RHFSwitchField from "../RHF/RHFSwitchField";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initial?: any | null;
};

export default function UserDialog({ open, onClose, onSave, initial }: Props) {
  const companies = getCompanies();
  const { user } = useAuth();
  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      display_name: "",
      email: "",
      contact_number: "",
      role: "user",
      // companyId: companies.length ? companies[0].id : null,
      status: "active",
      tenant_code: user.user_code.split("-")[0],
      user_code: "",
      address: "",
      password: "",
    },
  });

  useEffect(() => {
    if (initial) {
      methods.reset({ ...initial });
    } else {
      methods.reset({
        display_name: "",
        email: "",
        contact_number: "",
        role: "user",
        // companyId: companies.length ? companies[0].id : null,
        status: "active",
        tenant_code: user.user_code.split("-")[0],
        user_code: "",
        address: "",
        password: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, open]);

  const { handleSubmit } = methods;

  const submit = (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "primary.main",
          paddingY: "4px",
          alignItems: "center",
          color: "background.default",
        }}
      >
        {initial ? "Edit User" : "Add User"}
        <IconButton sx={{ color: "background.default" }}>
          <GridCloseIcon onClick={onClose} />
        </IconButton>
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="display_name" label="Name" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="email" label="Email" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="contact_number" label="Phone" />
              </Grid>
              {!initial && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFTextField
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFSelectField
                  name="role"
                  label="Role"
                  options={[
                    { label: "Admin", value: "admin" },
                    { label: "User", value: "user" },
                  ]}
                  defaultValue={"user"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="tenant_code"
                  label="Tenant Code"
                  disabled={true}
                />
                {/* <RHFSelectField
                  name="companyId"
                  label="Company"
                  options={companies.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  defaultValue={""}
                /> */}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="user_code"
                  label="User Code"
                  placeholder="User Code"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="address"
                  label="Address"
                  placeholder="Address"
                />
              </Grid>
              {initial && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFSwitchField name="status" label="Status" />
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {initial ? "Save" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
