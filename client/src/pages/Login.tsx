// Login.tsx (Parent Component)

import React, { useState } from 'react';
import LoginSheet from '../components/LoginSheet'; // Make sure the path is correct
import SignUp from '../components/SignupSheet'; // Make sure the path is correct
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from '@mui/material/Container';
import axios from 'axios';

const defaultTheme = createTheme();

function Login() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => setShowLogin(!showLogin);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    // This function should match the expected type in SignupSheetProps
  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implementation for handling sign-up form submission
  };

    try {
      const response = await axios.post('/api/login', { username, password });
      console.log('Login successful:', response.data);
      // Handle the successful login here, such as setting user session data
    } catch (error) {
      console.error('Login failed:', error);
      // Handle the login failure here, such as showing a notification
    }
  };

  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const signUpData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await axios.post('/api/signup', signUpData);
      console.log('Sign up successful:', response.data);
      // Handle the successful sign up here, such as redirecting to the login page
    } catch (error) {
      console.error('Sign up failed:', error);
      // Handle the sign up failure here, such as showing a notification
    }
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
            onSubmit={handleSignUpSubmit} // Pass the handleSignUpSubmit function here
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default Login;
