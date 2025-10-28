import React from 'react';
import { Box, IconButton, Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, Logout } = useAuth();
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  return (
    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* <IconButton color="inherit">
        <NotificationsIcon />
      </IconButton> */}

      <Box>
        <IconButton onClick={(e) => setAnchor(e.currentTarget)} color="inherit" size="small" sx={{ ml: 1 }}>
          <Avatar>{user?.name?.[0] ?? 'U'}</Avatar>
        </IconButton>
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              navigate(user?.role === 'admin' ? '/admin' : '/chat');
            }}
          >
            <Typography variant="body2">My Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              Logout();
              navigate('/auth/login');
            }}
          >
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
