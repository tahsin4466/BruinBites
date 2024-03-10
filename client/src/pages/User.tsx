import React, { useState } from 'react';
import HeaderMenu from '../components/HeaderMenu';
import ReviewsList from '../components/ReviewList'; // Import the ReviewsList component
import { Container, Grid, Avatar, Typography, Button, TextField } from '@mui/material';

const User: React.FC = () => {
  // Sample user information
  const [name, setName] = useState('John Doe');
  const [profilePhoto, setProfilePhoto] = useState('https://source.unsplash.com/random');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('example');

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
    // Implement logic to submit name change
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Left column for user information */}
          <Grid item xs={12} md={4}>
            <Avatar src={profilePhoto} sx={{ width: 150, height: 150, marginBottom: 2 }} />
            <Typography variant="h5" align="center" gutterBottom sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
              {name}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom sx={{ fontFamily: 'monospace' }}>
              {email}
            </Typography>

            {/* Text fields and buttons for editing user information */}
            <Grid container spacing={1}  sx={{ marginBottom: 2 }}>
              <Grid item xs={8}>
                <TextField
                  label="New Name"
                  variant="outlined"
                  value={name}
                  onChange={handleNameChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <Button variant="outlined" onClick={handleNameSubmit} fullWidth>
                  Change Name
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1}  sx={{ marginBottom: 2 }}>
              <Grid item xs={8}>
                <TextField
                  label="New Profile Photo URL"
                  variant="outlined"
                  value={profilePhoto}
                  onChange={handleProfilePhotoChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <Button variant="outlined" onClick={handleProfilePhotoSubmit} fullWidth>
                  Change Photo Pic
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1}  sx={{ marginBottom: 2 }}>
              <Grid item xs={8}>
                <TextField
                  label="New Email"
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <Button variant="outlined" onClick={handleEmailSubmit} fullWidth>
                  Change Email
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1}  sx={{ marginBottom: 2 }}>
              <Grid item xs={8}>
                <TextField
                  label="New Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <Button variant="outlined" onClick={handlePasswordSubmit} fullWidth>
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* Right column for reviews */}
          <Grid item xs={12} md={8}>
            <ReviewsList />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default User;
