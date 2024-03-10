// src/Header.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from './AuthContext';
import useLogout from './useLogout';
import './Header.css'; // Import the CSS file here

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);
//   console.log("*".repeat(100) + ``)
  const logout = useLogout();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          className="menu-button"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" className="title">
          Your App Name
        </Typography>
        {isAuthenticated && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
