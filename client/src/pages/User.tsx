import React, { useState } from 'react';
import HeaderMenu from '../components/HeaderMenu';
import ReviewsListUser from '../components/ReviewListUser';
import {
  Container, Grid, Avatar, Typography, Button, TextField, Drawer, IconButton, Fab, Box,
  useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const User: React.FC = () => {
  const [name, setName] = useState('John Doe');
  const [profilePhoto, setProfilePhoto] = useState('https://source.unsplash.com/random');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('example');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfilePhoto(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleNameSubmit = () => {
    console.log('handleNameSubmit called'); // Add this line
    // Prepare data for API call
    const userData = {
      name: name,
      email: email,
      password: password,
      photo: profilePhoto
    };
    const jsonData = JSON.stringify(userData);

    // Now you can use jsonData in your API call
    console.log(jsonData);
  };

  const handleProfilePhotoSubmit = () => {
    // Implement logic to submit profile photo change
  };

  const handleEmailSubmit = () => {
    // Implement logic to submit email change
  };

  const handlePasswordSubmit = () => {
    // Implement logic to submit password change
  };

  return (
    <>
      <HeaderMenu />
      <Container maxWidth="lg" sx={{ mt: 4, position: 'relative' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <div style={{maxHeight: 'calc(100vh - 64px)', overflowY: 'auto'}}>
              <Avatar src={profilePhoto} sx={{width: 150, height: 150, marginBottom: 2}}/>
              <Typography variant="h5" align="center" gutterBottom sx={{fontFamily: 'monospace', fontWeight: 'bold'}}>
                {name}
              </Typography>
              <Typography variant="body1" align="center" gutterBottom sx={{fontFamily: 'monospace'}}>
                {email}
              </Typography>

              <Grid container spacing={1} sx={{marginBottom: 2}}>
                <Grid item xs={8}>
                  <TextField
                      label="New Name"
                      variant="outlined"
                      value={name}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button variant="outlined" onClick={() => {}} fullWidth>
                    Change Name
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={1} sx={{marginBottom: 2}}>
                <Grid item xs={8}>
                  <TextField
                      label="New Profile Photo URL"
                      variant="outlined"
                      value={profilePhoto}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setProfilePhoto(event.target.value)}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button variant="outlined" onClick={() => {}} fullWidth>
                    Change Photo
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={1} sx={{marginBottom: 2}}>
                <Grid item xs={8}>
                  <TextField
                      label="New Email"
                      variant="outlined"
                      value={email}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button variant="outlined" onClick={() => {}} fullWidth>
                    Change Email
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={1} sx={{marginBottom: 2}}>
                <Grid item xs={8}>
                  <TextField
                      label="New Password"
                      variant="outlined"
                      type="password"
                      value={password}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button variant="outlined" onClick={() => {}} fullWidth>
                    Change Password
                  </Button>
                </Grid>
              </Grid>
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
                style={{position: 'absolute', right: 8, top: 8, zIndex: 1}}
            >
              <CloseIcon/>
            </IconButton>
            <div
                style={{height: '100vh', overflow: 'auto'}}
            >
                <ReviewsListUser/>
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
