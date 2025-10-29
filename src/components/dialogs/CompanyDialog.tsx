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
import { companySchema } from "../../validation/companySchema";
import { type Company } from "../../store/mockData";
import { GridCloseIcon } from "@mui/x-data-grid";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Company>) => void;
  initial?: Company | null;
};

export default function CompanyDialog({
  open,
  onClose,
  onSave,
  initial,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(companySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      slug_url: "",
      tenant_code: "",
      // status: "active" as "active" | "inactive",
    },
  });

  useEffect(() => {
    if (initial) {
      methods.reset({ ...initial });
    } else {
      methods.reset({
        name: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        slug_url: "",
        tenant_code: "",
        // status: "active",
      });
    }
  }, [initial, open]);

  const { handleSubmit } = methods;

  const submit = (data: any) => {
    onSave(data);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "primary.main",
          paddingY: "8px",
          alignItems: "center",
          color: "background.default",
        }}
      >
        {initial ? "Edit Company" : "Add Company"}
        <IconButton sx={{ color: "background.default" }}>
          <GridCloseIcon onClick={onClose} />
        </IconButton>
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)}>
          <DialogContent
            sx={{
              overflowY: "auto",
              maxHeight: "70vh", // scrollable area height
              paddingRight: 2,
            }}
          >
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="name" label="Company Name" placeholder="Company name" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="email" label="Contact Email" placeholder="Email" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="phone" label="Phone" placeholder="Phone" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="website" label="Website" placeholder="https://example.com" />
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }}>
                <RHFTextField name="address" label="Address" placeholder="Address" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="tenant_code" label="Tenant Code" placeholder="Tenant code" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="slug_url" label="Slug URL" placeholder="https://example/demo" />
              </Grid>
              {/* {initial && (
                <Grid sx={{ ml: 2 }} size={{ xs: 12, sm: 2 }}>
                  <RHFSwitchField name="status" label="Status" />
                </Grid>
              )} */}
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {initial ? "Save changes" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
