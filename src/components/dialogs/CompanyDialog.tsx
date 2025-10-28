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
import { isCompanyUrlAvailable, type Company } from "../../store/mockData";
import { GridCloseIcon } from "@mui/x-data-grid";
import RHFSwitchField from "../RHF/RHFSwitchField";

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
      url: "",
      status: "active" as "active" | "inactive",
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
        url: "",
        status: "active",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, open]);

  const { handleSubmit, watch, setError, clearErrors } = methods;

  const watchedUrl = watch("url");

  // perform client-side uniqueness check when URL changes
  useEffect(() => {
    if (!watchedUrl) return;
    const isAvailable = isCompanyUrlAvailable(watchedUrl, initial?.id);
    if (!isAvailable) {
      setError("url", { type: "manual", message: "URL already taken" });
    } else {
      clearErrors("url");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedUrl]);

  const submit = (data: any) => {
    // final check
    const available = isCompanyUrlAvailable(data.url, initial?.id);
    if (!available) {
      setError("url", { type: "manual", message: "URL already taken" });
      return;
    }
    onSave(data);
    console.log(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
          <DialogContent>
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="name" label="Company Name" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="email" label="Contact Email" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="phone" label="Phone" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="website" label="Website" />
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }}>
                <RHFTextField name="address" label="Address" />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <RHFTextField name="url" label="Company URL" />
              </Grid>
              {initial && (
                <Grid sx={{ ml: 2 }} size={{ xs: 12, sm: 2 }}>
                  <RHFSwitchField name="status" label="Status" />
                </Grid>
              )}
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
