import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../authentication/AuthContext';
import useLogout from '../authentication/useLogout';
import { Link } from 'react-router-dom'; // Import the Link component
import './Header.css'; // Import the CSS file here

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);
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
          React Login Demo
        </Typography>
        <Link to="/trainModel" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button color="inherit">
            Train Model
          </Button>
        </Link>
        <Link to="/userModels" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button color="inherit">
            User Models
          </Button>
        </Link>
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
