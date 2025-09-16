import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Left: Logo / Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chronos
        </Typography>

        {/* Center: Navigation buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 2 }}>
          <Button color="inherit" href="/dashboard">Dashboard</Button>
          <Button color="inherit" href="/calendar">Calendar</Button>
          <Button color="inherit" href="/profile">Profile</Button>
        </Box>

        {/* Right: Profile menu */}
        <div>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenu}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
