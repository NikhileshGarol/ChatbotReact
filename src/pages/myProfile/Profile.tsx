import React, { useState } from "react";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  IconButton,
} from "@mui/material";
import RHFTextField from "../../components/RHF/RHFTextField";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AdminLayout from "../../layouts/AdminLayout";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUserImage,
  postUserImage,
  updateCurrentUser,
} from "../../services/user.service";
import { useEffectOnce } from "../../hooks/useEffectOnce";
import { useSnackbar } from "../../contexts/SnackbarContext";

const schema = yup.object({
  display_name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  contact_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[0-9\- ]{10,}$/, "Invalid phone number"),
  address: yup.string().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

const Profile: React.FC = () => {
  const { user, setUser, refreshProfileImage } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  // Initialize form with default values from user (example hardcoded)
  const defaultValues: FormData = {
    display_name: user.display_name,
    email: user.email,
    contact_number: user.contact_number,
    address: user.address,
  };

  const methods = useForm<FormData>({
    resolver: yupResolver(schema) as unknown as Resolver<FormData>,
    defaultValues,
  });

  useEffectOnce(() => {
    getProfileImage();
  });

  const getProfileImage = async () => {
    try {
      const response = await getUserImage(); // response is a Blob
      const objectUrl = URL.createObjectURL(response);
      setPreview(objectUrl);
      refreshProfileImage();
    } catch (error) {
      console.error(error);
    }
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAvatarFile(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setAvatarFile(null);
      setPreview(null);
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      if (avatarFile) {
        const response = await postUserImage(avatarFile);
        setUser(response);
      }
      const response = await updateCurrentUser(data);
      console.log(response);
      setUser(response);
      showSnackbar("success", "Profile details updated successfully");
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      showSnackbar("error", message);
    }
  };

  return (
    <AdminLayout>
      <Box>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            My Profile
          </Typography>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                <Grid container size={{ xs: 12, md: 8 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <RHFTextField name="display_name" label="Full Name" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <RHFTextField disabled name="email" label="Email" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <RHFTextField name="contact_number" label="Phone Number" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <RHFTextField name="address" label="Address" />
                  </Grid>
                </Grid>
                <Grid sx={{ ml: 4 }} container size={{ xs: 12, md: 2 }}>
                  {/* Avatar Upload */}
                  <Box
                    sx={{
                      //   mt: 2,
                      position: "relative",
                      width: 150,
                      height: 140,
                    }}
                  >
                    {/* Avatar or preview image */}
                    {preview ? (
                      <Box
                        component="img"
                        src={preview}
                        alt="Profile Avatar"
                        sx={{
                          width: 150,
                          height: 150,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 150,
                          height: 150,
                          bgcolor: "grey.300",
                        }}
                      >
                        {/* Initials or icon */}
                      </Avatar>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      hidden
                      onChange={onAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                      <IconButton
                        component="span"
                        color="primary"
                        aria-label="Upload profile picture"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "background.paper",
                          borderRadius: "50%",
                          boxShadow: 1,
                          "&:hover": {
                            bgcolor: "grey",
                          },
                          padding: 0.5,
                        }}
                      >
                        <CameraAltIcon fontSize="small" />
                      </IconButton>
                    </label>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </form>
          </FormProvider>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default Profile;
