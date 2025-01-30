import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleMakeRequest } from '../app/RequestNavigator';
import { TextField, Button, Container, Box, Typography, CssBaseline } from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetToken('');
    setMessage('');

    try {
      const response = await handleMakeRequest(
        navigate,
        '/api/forgot_password',
        'POST',
        { email },
        {},
        false
      );
      if (response.data.reset_token) {
        // Show the user the token for demonstration
        setResetToken(response.data.reset_token);
      } else {
        // The server might respond with: { "message": "If that email exists, a reset was sent." }
        setMessage(response.data.message || 'Check your email if that account exists.');
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage('Failed to request password reset.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8 }}>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={handleForgotPassword}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Request Reset
          </Button>
        </Box>

        {resetToken && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Your reset token (for demo): <strong>{resetToken}</strong>
          </Typography>
        )}
        {message && (
          <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}

        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
