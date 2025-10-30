import React from 'react';
import { Box, IconButton, Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
  const { user, Logout, profileImage } = useAuth();
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        ml: "auto",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
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
          <Avatar
            sx={{ height: "35px", width: "35px" }}
            src={profileImage || "UA"}
            alt={user.display_name}
          />
          <ArrowDropDownIcon />
        </IconButton>
        <Menu
          anchorEl={anchor}
          open={!!anchor}
          onClose={() => setAnchor(null)}
          PaperProps={{
            sx: {
              boxShadow: 3,
              minWidth: 150,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchor(null);
              navigate("/profile");
            }}
            sx={{
              px: 2,
              borderBottom: "1px solid lightgrey",
            }}
          >
            <Typography variant="body2"><AccountCircleIcon fontSize='small' /> My Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null);
              Logout();
            }}
            sx={{
              px: 2,
            }}
          >
            <Typography variant="body2"><LogoutIcon fontSize='small' />Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
