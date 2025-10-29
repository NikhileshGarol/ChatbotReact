import React from 'react';
import { Box, IconButton, Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Header() {
  const { user, Logout, profileImage } = useAuth();
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  return (
    <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
      {/* <IconButton color="inherit">
        <NotificationsIcon />
      </IconButton> */}

      <Box>
        <IconButton
          onClick={(e) => setAnchor(e.currentTarget)}
          color="inherit"
          size="small"
          sx={{ ml: 1 }}
        >
          <Avatar key={user.id} src={profileImage || "UA"} alt="User avatar" />
          <ArrowDropDownIcon />
        </IconButton>
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              navigate("/profile");
            }}
          >
            <Typography variant="body2">My Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              Logout();
            }}
          >
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
