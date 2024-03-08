// Login.tsx (Parent Component)

import React, { useState } from 'react';
import LoginSheet from '../components/LoginSheet'; // Ensure this path is correct
import SignUp from '../components/SignupSheet'; // Ensure this path is correct
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from '@mui/material/Container';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

const defaultTheme = createTheme();

const Login: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const toggleForm = () => setShowLogin(!showLogin);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await axios.post('/api/login', { username, password });
      console.log('Login successful:', response.data);

    } catch (error: any) { // Adjusting to catch block for TypeScript
      console.error('Login failed:', error);
    }
  };

  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const signUpData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await axios.post('/api/signup', signUpData);
      console.log('Sign up successful:', response.data);
      toggleForm();
    } catch (error: any) { // Adjusting to catch block for TypeScript
      console.error('Sign up failed:', error);
      const errorMessage = error.response && error.response.data.message ? error.response.data.message : 'Login failed';
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent<any, Event> | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {showLogin ? (
          <LoginSheet
            onToggleForm={toggleForm}
            onSubmit={handleLoginSubmit}
          />
        ) : (
          <SignUp
            onToggleForm={toggleForm}
            onSubmit={handleSignUpSubmit} // Ensure handleSignUpSubmit is correctly passed
          />
        )}
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Login;
