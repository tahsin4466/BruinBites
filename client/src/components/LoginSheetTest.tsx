import React, { useEffect } from 'react';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Add Google Sign-In button component
import GoogleLogin from 'react-google-login';

const defaultTheme = createTheme();

type LoginSheetProps = {
  onToggleForm: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  // Add any additional props needed for handling Google Sign-In
};

export default function SignIn(props: LoginSheetProps) {
  // Function to handle username input change
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setUsername(event.target.value);
  };

  // Function to handle password input change
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setPassword(event.target.value);
  };

  // Handle Google Sign-In success
  const responseGoogle = (response: any) => {
    console.log('Google profile', response.profileObj);
    // Perform actions after successful Google Sign-In, e.g., setting user state or redirecting
  };

  // Handle Google Sign-In failure
  const handleFailure = (error: any) => {
    console.log('Google Sign-In failed', error);
    // Optionally handle sign-in failure, e.g., show an error message
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
            <LockPersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box component="form" onSubmit={props.onSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={handleUsernameChange}
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
            <GoogleLogin
              clientId="YOUR_CLIENT_ID.apps.googleusercontent.com" // Replace with your Google Client ID
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={handleFailure}
              cookiePolicy={'single_host_origin'}
            />
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" onClick={props.onToggleForm}>
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
