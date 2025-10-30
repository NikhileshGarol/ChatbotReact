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
  CircularProgress,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFTextField from "../RHF/RHFTextField";
import { userSchema } from "../../validation/userSchema";
import { GridCloseIcon } from "@mui/x-data-grid";
import RHFSelectField from "../RHF/RHFSelectField";
import { useAuth } from "../../contexts/AuthContext";
import {
  getCompanyAdminById,
  listCompanies,
} from "../../services/company.service";
import { City, Country, State } from "country-state-city";
import { getUserById } from "../../services/user.service";
import LoadingOverlay from "../LoadingOverlay";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initial?: any | null;
  loading?: boolean;
};

export default function UserDialog({
  open,
  onClose,
  onSave,
  initial,
  loading,
}: Props) {
  const { user } = useAuth();
  const [companyList, setCompanyList] = useState<any[]>([]);
  const isSuperAdmin = user?.role === "superadmin";
  const [isLoading, setIsLoading] = useState(false);
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

  const methods = useForm({
    resolver: yupResolver(userSchema, { context: { isSuperAdmin, initial } }),
    defaultValues: {
      display_name: "",
      email: "",
      contact_number: "",
      role: isSuperAdmin ? "admin" : "user",
      company_name: companyList.length ? companyList[0].id : null,
      // status: "active",
      tenant_code: "",
      user_code: "",
      address: "",
      password: "",
      country: "",
      state: "",
      city: "",
      firstname: "",
      lastname: "",
    },
  });
  const { handleSubmit, watch, setValue } = methods;

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedCompany = watch("company_name")

  useEffect(() => {
    if(selectedCompany) {
      methods.setValue("tenant_code", selectedCompany)
    }
  },[selectedCompany])

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }));
      setStateOptions(states);
      if (!initial) {
        methods.setValue("state", ""); // reset state
        setCityOptions([]);
        methods.setValue("city", ""); // reset city
      }
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
      if (!initial) {
        methods.setValue("city", ""); // reset city if state changes
      }
    }
  }, [selectedState, selectedCountry, methods]);

  useEffect(() => {
    if (initial && !isSuperAdmin) {
      fetchUserById();
    } else if (open && initial && isSuperAdmin) {
      getAllCompanies();
      fetchAdminById();
    } else {
      methods.reset({
        display_name: "",
        email: "",
        contact_number: "",
        role: isSuperAdmin ? "admin" : "user",
        company_name: companyList.length ? companyList[0].id : null,
        // status: "active",
        tenant_code: !isSuperAdmin ? user.user_code.split("-")[0] : "",
        user_code: "",
        address: "",
        password: "",
        country: "",
        state: "",
        city: "",
      });
    }
  }, [initial, open]);

  const fetchUserById = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserById(initial.id);
      methods.reset(userData);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminById = async () => {
    try {
      setIsLoading(true);
      const userData = await getCompanyAdminById(initial.id);
      methods.reset(userData);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const watchedCompanyId = watch("company_name");

  useEffect(() => {
    if (watchedCompanyId) {
      const selectedCompany = companyList.find(
        (c) => c.id === watchedCompanyId
      );
      if (selectedCompany) {
        const newTenantCode = selectedCompany.tenant_code?.split("-")[0] || "";
        setValue("tenant_code", newTenantCode);
      }
    }
  }, [watchedCompanyId, companyList, setValue]);

  const getAllCompanies = async () => {
    try {
      const response = await listCompanies();
      setCompanyList(response);
    } catch (error) {
      console.log(error);
    }
  };

  const submit = (data: any) => {
    onSave(data);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "primary.main",
          paddingY: "2px",
          alignItems: "center",
          color: "background.default",
        }}
      >
        <Typography>{initial ? "Edit User" : "Add User"}</Typography>
        <IconButton sx={{ color: "background.default" }}>
          <GridCloseIcon onClick={onClose} />
        </IconButton>
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)}>
          <DialogContent
            sx={{
              overflowY: "auto",
              maxHeight: "70vh",
              paddingRight: 2,
            }}
          >
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFTextField
                  name="firstname"
                  label="First Name"
                  placeholder="First Name"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFTextField
                  name="lastname"
                  label="Last Name"
                  placeholder="Last Name"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFTextField name="email" label="Email" placeholder="Email" />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFTextField
                  name="contact_number"
                  label="Phone"
                  placeholder="Phone"
                />
              </Grid>
              {!initial && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <RHFTextField
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFSelectField
                  name="role"
                  label="Role"
                  options={
                    isSuperAdmin
                      ? [{ label: "Admin", value: "admin" }]
                      : [
                          { label: "Admin", value: "admin" },
                          { label: "User", value: "user" },
                        ]
                  }
                  defaultValue={"user"}
                />
              </Grid>
              {isSuperAdmin && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <RHFSelectField
                    name="company_name"
                    label="Company"
                    options={companyList.map((c) => ({
                      label: c.name,
                      value: c.name,
                    }))}
                    defaultValue={"Select Company"}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFTextField
                  name="tenant_code"
                  label="Tenant Code"
                  disabled={true}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <RHFTextField
                  name="user_code"
                  label="User Code"
                  placeholder="User Code"
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
              {/* {initial && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFSwitchField name="status" label="Status" />
                </Grid>
              )} */}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ boxShadow: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : initial ? (
                "Save"
              ) : (
                "Create"
              )}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
      {isLoading && <LoadingOverlay loading={isLoading} />}
    </Dialog>
  );
}
