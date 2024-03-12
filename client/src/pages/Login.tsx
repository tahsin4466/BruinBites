import React, { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from '@mui/material/Container';
import { Snackbar, Alert } from '@mui/material';
import CombinedLogin from '../components/LoginSheet';
import SignUp from '../components/SignupSheet';

// Define your AuthContext and AuthProvider outside of the Login component
interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider should be defined and used at the top level of your component tree, not inside Login
const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const defaultTheme = createTheme();

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setAuthenticated } = useAuth(); // Destructure isAuthenticated here
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const toggleForm = () => setShowLogin(!showLogin);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.status === 'success') {
        console.log('Login successful:', response.data);
        setAuthenticated(true);
        navigate('/search');
      } else {
        console.error('Login failed:', response.data.message);
        setSnackbarMessage(response.data.message || 'Login failed');
        setOpenSnackbar(true);
      }
    } catch (error: any) {
      console.error('Login request failed:', error);
      setSnackbarMessage(error.response?.data?.message || 'Login request failed');
      setOpenSnackbar(true);
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
      const errorMessage = error.response && error.response.data.message ? error.response.data.message : 'Sign up failed';
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent<any, Event> | Event,
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
          <CombinedLogin
            onToggleForm={toggleForm}
            onSubmit={handleLoginSubmit}
          />
        ) : (
          <SignUp
            onToggleForm={toggleForm}
            onSubmit={handleSignUpSubmit}
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
};

// Ensure to wrap the component that uses useAuth hook within AuthProvider in the component tree.
export default () => (
  <AuthProvider>
    <Login />
  </AuthProvider>
);