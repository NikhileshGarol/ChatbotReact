import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFTextField from "../RHF/RHFTextField";
import { companySchema } from "../../validation/companySchema";
import { type Company } from "../../store/mockData";
import { GridCloseIcon } from "@mui/x-data-grid";
import { City, Country, State } from "country-state-city";
import RHFSelectField from "../RHF/RHFSelectField";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Company>) => void;
  initial?: any | null;
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
      // slug_url: "",
      tenant_code: "",
      country: "",
      state: "",
      city: "",
      // status: "active" as "active" | "inactive",
    },
  });

  useEffect(() => {
    if (initial) {
      console.log(initial)
      methods.reset({ ...initial });
    } else {
      methods.reset({
        name: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        // slug_url: "",
        tenant_code: "",
        // status: "active",
        country: "",
        state: "",
        city: "",
      });
    }
  }, [initial, open]);

  const { handleSubmit, watch } = methods;

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // State to store options
  const [countryOptions, setCountryOptions] = useState(
    Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.isoCode,
    }))
  );
  const [stateOptions, setStateOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }));
      setStateOptions(states);
      methods.setValue("state", ""); // reset state
      setCityOptions([]);
      methods.setValue("city", ""); // reset city
    }
  }, [selectedCountry, methods]);

  useEffect(() => {
    if (selectedState && selectedCountry) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map(
        (ci) => ({
          label: ci.name,
          value: ci.name,
        })
      );
      setCityOptions(cities);
      methods.setValue("city", ""); // reset city if state changes
    }
  }, [selectedState, selectedCountry, methods]);

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
          paddingY: "2px",
          alignItems: "center",
          color: "background.default",
        }}
      ><Typography>
        {initial ? "Edit Company" : "Add Company"}
        </Typography>
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
                <RHFTextField
                  name="name"
                  label="Company Name"
                  placeholder="Company name"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="email"
                  label="Contact Email"
                  placeholder="Email"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField name="phone" label="Phone" placeholder="Phone" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="website"
                  label="Website"
                  placeholder="https://example.com"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFSelectField
                  name="country"
                  label="Country"
                  options={countryOptions.map((c) => ({
                    label: c.label,
                    value: c.value,
                  }))}
                  placeholder={"Select Country"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFSelectField
                  name="state"
                  label="State"
                  options={stateOptions.map((c) => ({
                    label: c.label,
                    value: c.value,
                  }))}
                  placeholder={"Select State"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFSelectField
                  name="city"
                  label="City"
                  options={cityOptions.map((c) => ({
                    label: c.label,
                    value: c.value,
                  }))}
                  placeholder={"Select City"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }}>
                <RHFTextField
                  name="address"
                  label="Address"
                  placeholder="Address"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="tenant_code"
                  label="Tenant Code"
                  placeholder="Tenant code"
                />
              </Grid>
              {/* <Grid size={{ xs: 12, sm: 6 }}>
                <RHFTextField
                  name="slug_url"
                  label="Slug URL"
                  placeholder="https://example/demo"
                />
              </Grid> */}
              {/* {initial && (
                <Grid sx={{ ml: 2 }} size={{ xs: 12, sm: 2 }}>
                  <RHFSwitchField name="status" label="Status" />
                </Grid>
              )} */}
            </Grid>
          </DialogContent>

          <DialogActions sx={{boxShadow: 2}}>
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
