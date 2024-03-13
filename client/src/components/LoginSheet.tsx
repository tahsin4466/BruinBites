import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleLogin from 'react-google-login';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const defaultTheme = createTheme();

declare global {
  interface Window {
    onSignIn: (googleUser: any) => void;
  }
}

interface CombinedLoginProps {
  onToggleForm: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; // Or Promise<void> if it's asynchronous
}

export default function CombinedLogin({ onToggleForm, onSubmit }: CombinedLoginProps) {
  // State hooks for email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event); // This should work without errors now
  };

  const responseGoogle = (response: any) => {
    const profile = response.profileObj;
    console.log('Google profile', profile);
    // Implement your Google Sign-In logic here
  };

  const handleFailure = (error: any) => {
    console.log('Google Sign-In failed', error);
    // Optionally handle sign-in failure
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleEmailChange}
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
              onChange={handlePasswordChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {/* Google Sign-In button */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              clientId="1032108831904-nu6qkm5g3m3ghc9p3g2340bc9thcaaed.apps.googleusercontent.com" // Replace with your Google Client ID
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={handleFailure}
              cookiePolicy={'single_host_origin'}
            />
            </Box>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" onClick={onToggleForm}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}