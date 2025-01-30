import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  CssBaseline,
  Link
} from '@mui/material';  // <-- Import MUI's Link
import './Login.css';
import { handleMakeRequest } from '../app/RequestNavigator';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await handleMakeRequest(
        navigate,
        '/api/login/',
        'POST',
        { email, password },
        {},
        false
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
        localStorage.setItem('access_token', response.data.access_token);
        navigate('/userModels');
      }
    } catch (error) {
      console.error("Login failed:", error);
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
            id="email"
            label="Email"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            name="password"
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

        {/* Links row */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Don&apos;t have an account?{' '}
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{ fontWeight: 'bold', textDecoration: 'none' }}
            >
              Register
            </Link>
          </Typography>

          <Typography variant="body2">
            <Link
              component={RouterLink}
              to="/forgotPassword"
              variant="body2"
              sx={{ textDecoration: 'none', fontStyle: 'italic' }}
            >
              Forgot Password?
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
