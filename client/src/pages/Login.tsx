import React, { useState } from 'react';
import LoginSheet from '../components/LoginSheet';
import SignUp from '../components/SignupSheet';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from '@mui/material/Container';
import axios from 'axios'; // Import axios for making HTTP requests

const defaultTheme = createTheme();

function LoginPage() {
  const [showLogin, setShowLogin] = useState(true); // true to show login, false to show signup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleForm = () => setShowLogin(!showLogin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      // Handle successful login
      console.log('Login successful:', response.data);
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {showLogin ? (
          <LoginSheet
            onToggleForm={toggleForm}
            onSubmit={handleSubmit} // Pass handleSubmit function to LoginSheet
            setUsername={setUsername} // Pass setUsername function to LoginSheet
            setPassword={setPassword} // Pass setPassword function to LoginSheet
          />
        ) : (
          <SignUp onToggleForm={toggleForm} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
