// This page is only accessible if the user is already logged in
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleMakeRequest } from '../app/RequestNavigator';
import { TextField, Button, Container, Box, Typography, CssBaseline } from '@mui/material';

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await handleMakeRequest(
        navigate,
        '/api/update_password',
        'POST',
        { new_password: newPassword },
        {},
        true
      );
      if (response.status === 200) {
        setMessage('Your password has been updated successfully.');
      }
    } catch (error) {
      console.error("Update password error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setMessage(error.response.data.detail);
      } else {
        setMessage('Failed to update password.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8 }}>
        <Typography component="h1" variant="h5">
          Update Password
        </Typography>
        <Box component="form" onSubmit={handleUpdatePassword}>
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
            Update Password
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
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}

export default UpdatePassword;
