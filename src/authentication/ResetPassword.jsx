// src/authentication/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleMakeRequest } from '../app/RequestNavigator';
import { TextField, Button, Container, Box, Typography, CssBaseline } from '@mui/material';

function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await handleMakeRequest(
        navigate,
        '/api/reset_password',
        'POST',
        { reset_token: token, new_password: newPassword },
        {},
        True
      );
      if (response.status === 200) {
        setMessage('Password reset successful! You can now log in.');
      }
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setMessage(error.response.data.detail);
      } else {
        setMessage('Failed to reset password.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8 }}>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleResetPassword}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Reset Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </Button>
        </Box>

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

export default ResetPassword;
