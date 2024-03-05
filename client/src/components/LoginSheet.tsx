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

const defaultTheme = createTheme();

type LoginSheetProps = {
  onToggleForm: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; // Add onSubmit prop
  setUsername: React.Dispatch<React.SetStateAction<string>>; // Add setUsername prop
  setPassword: React.Dispatch<React.SetStateAction<string>>; // Add setPassword prop
};

export default function SignIn(props: LoginSheetProps) {
  // Function to handle username input change
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setUsername(event.target.value); // Update username state
  };

  // Function to handle password input change
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setPassword(event.target.value); // Update password state
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
          <Box component="form" onSubmit={props.onSubmit} noValidate sx={{ mt: 1 }}> {/* Use onSubmit prop */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username" // Change id to "username"
              label="Username" // Change label to "Username"
              name="username" // Change name to "username"
              autoComplete="username" // Change autoComplete to "username"
              autoFocus
              onChange={handleUsernameChange} // Handle username change
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
              onChange={handlePasswordChange} // Handle password change
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
