import React, { useState } from 'react';
import LoginSheet from '../components/LoginSheet';
import SignUp from '../components/SignupSheet';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from '@mui/material/Container';

const defaultTheme = createTheme();

function MainPage() {
  const [showLogin, setShowLogin] = useState(true); // true to show login, false to show signup

  const toggleForm = () => setShowLogin(!showLogin);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {showLogin ? (
          <LoginSheet onToggleForm={toggleForm} />
        ) : (
          <SignUp onToggleForm={toggleForm} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default MainPage;
