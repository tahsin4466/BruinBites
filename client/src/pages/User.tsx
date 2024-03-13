import React, { useState, useEffect } from 'react';
import HeaderMenu from '../components/HeaderMenu';
import ReviewsListUser from '../components/ReviewListUser';
import {
  Container, Grid, Avatar, Typography, Button, TextField, Drawer, IconButton, Fab, Box,
  useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const User: React.FC = () => {
  const [firstName, setFirstName] = useState('Loading...');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('Loading...');
  const [password, setPassword] = useState('example');
  const [drawerOpen, setDrawerOpen] = useState(false);
  // New state for file upload and preview
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    // Determine if the image and password were updated based on whether they are not null/empty
    const updatedImage = Boolean(file); // true if a file was selected
    const updatedPassword = password !== 'example' && password.trim() !== ''; // Assuming 'example' is your default or placeholder value

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    if (updatedPassword) {
        formData.append('password', password);
    }
    if (updatedImage && file) {
      formData.append('profilePhoto', file, file.name);
    }

    // Append booleans to formData as strings (since formData supports string values only)
    formData.append('updatedImage', String(updatedImage));
    console.log(updatedImage)
    formData.append('updatedPassword', String(updatedPassword));
    console.log(updatedPassword)

    try {
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      // Handle success response, such as updating UI or showing a success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle errors, such as displaying an error message to the user
    }
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
              <ReviewsListUser />
            </Grid>
          )}
        </Grid>
      </Container>
    </>

  );
};


export default User;
