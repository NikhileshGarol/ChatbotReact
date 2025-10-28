import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../layouts/AdminLayout';

export default function ChatScreen() {
  const { user } = useAuth();

  return (
    <AdminLayout>
    <Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Chat — {user?.companyId ?? 'Company'}</Typography>
        <Box sx={{ mt: 2, minHeight: 300, border: '1px dashed #ddd', p: 2 }}>
          <Typography variant="body2" color="text.secondary">Conversation area (mock)</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <TextField fullWidth placeholder="Ask the bot..." />
          <Button variant="contained">Send</Button>
        </Box>
      </Paper>
    </Box>
    </AdminLayout>
  );
}
