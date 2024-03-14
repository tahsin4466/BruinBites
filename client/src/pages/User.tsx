import React, { useState, useEffect } from 'react';
import HeaderMenu from '../components/HeaderMenu';
import ReviewsListUser from '../components/ReviewListUser';
import {
  Container, Grid, Avatar, Typography, Button, TextField, Drawer, IconButton, Fab, Box,
  useMediaQuery, useTheme, Alert, Snackbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const User: React.FC = () => {
  const [firstName, setFirstName] = useState('Loading...');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('Loading...');
  const [date, setDate] = useState('Loading...');
  const [password, setPassword] = useState('example');
  const [drawerOpen, setDrawerOpen] = useState(false);
  // New state for file upload and preview
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>("https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png?20091205084734");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/personalInfo');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming your API returns a full name, split it for first and last name fields
        const [first, ...last] = data.name.split(' ');
        setFirstName(first);
        setLastName(last.join(' ')); // Join the rest back in case there are multiple parts to the last name
        setEmail(data.email);
        setDate(data.date)
        if (data.userPFP) {
          setPreviewUrl(data.userPFP);
        }
      } catch (error) {
        console.error("Could not fetch user data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleUpdateInfo = async () => {
  const formData = new FormData();

  const updatedImage = Boolean(file);
  const updatedPassword = password !== 'example' && password.trim() !== '';

  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('email', email);
  if (updatedPassword) {
      formData.append('password', password);
  }
  if (updatedImage && file) {
    formData.append('profilePhoto', file, file.name);
  }

  formData.append('updatedImage', String(updatedImage));
  formData.append('updatedPassword', String(updatedPassword));

  try {
    const response = await fetch('/api/updateProfile', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    // Check if the update was successful or failed based on the backend response
    if (result.status === 'failure') {
      // Display the error message from the backend in the Snackbar
      setSnackbarMessage(result.message);
      setOpenSnackbar(true);
    } else {
      // Assuming the update was successful, handle the success case (e.g., show a success message)
      console.log('Success:', result);
      // You can also use the Snackbar to show a success message
      setSnackbarMessage('Profile updated successfully!');
      setOpenSnackbar(true);
      // Reset the form or navigate the user elsewhere as needed
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    // Display a generic error message or handle the error specifically
    setSnackbarMessage('Error updating profile. Please try again.');
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
        <>
      <HeaderMenu />
      <Container maxWidth="lg" sx={{ mt: 4, position: 'relative' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <div style={{ maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
              {previewUrl ? (
                <Avatar src={previewUrl} sx={{ width: 150, height: 150, marginBottom: 2 }} />
              ) : (
                <Avatar sx={{ width: 150, height: 150, marginBottom: 2 }} />
              )}
              <Typography variant="h5" align="center" gutterBottom sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                {`${firstName} ${lastName}`}
              </Typography>
              <Typography variant="body1" align="center" gutterBottom sx={{ fontFamily: 'monospace' }}>
                {email}
              </Typography>
              <Typography variant="body2" align="center" gutterBottom sx={{ fontFamily: 'monospace' }}>
                Member since {date}
              </Typography>
              <Typography variant="h5">‎</Typography>
              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="New Password"
                variant="outlined"
                type="password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <Button variant="contained" component="label" fullWidth sx={{ marginBottom: 2 }}>
                Upload Photo
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <Button variant="outlined" onClick={handleUpdateInfo} fullWidth>
                Update Info
              </Button>
            </div>
          </Grid>

          {isMobile && (
            <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 16, right: 16 }}>
              <Fab color="primary" aria-label="add" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </Fab>
            </Box>
          )}

          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <IconButton
              onClick={toggleDrawer(false)}
              style={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
            >
              <CloseIcon />
            </IconButton>
            <div style={{ height: '100vh', overflow: 'auto' }}>
              <ReviewsListUser />
            </div>
          </Drawer>

          {!isMobile && (
            <Grid item xs={12} md={8}>
              <Typography align="center" style={{fontWeight: 'bold', fontFamily: 'monospace'}} variant="h5">My Past Reviews</Typography>
              <ReviewsListUser />
            </Grid>
          )}
        </Grid>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Container>
    </>

  );
};


export default User;
