import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 6, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>403 — Unauthorized</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You do not have permission to view this page or the page does not exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Box>
  );
}
