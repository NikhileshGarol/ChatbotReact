import AdminLayout from "../../layouts/AdminLayout";
import { Box, Typography, Grid, Paper } from "@mui/material";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Admin Dashboard
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              Companies: <strong>3</strong>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              Users: <strong>27</strong>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              Training Jobs: <strong>1 running</strong>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}
