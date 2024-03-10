import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { TextField, Button, Container, Box, Typography, CssBaseline } from '@mui/material';
import './Login.css'; // Import the CSS file here


// axios.defaults.withCredentials = true;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login/', { username, password }, { withCredentials: true });
    
      // const history = useHistory();
      if (response.status === 200) {
        setIsAuthenticated(true); // Update authentication state
        console.log(`token: ${JSON.stringify(response)}`)
        localStorage.setItem('access_token', response.data.access_token);
        window.location.replace('/');
          
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., display an error message)
      setIsAuthenticated(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box className="login-container">
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="form">
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="submit-button"
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
