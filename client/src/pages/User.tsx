import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import ReviewsList from '../components/ReviewList'; // Import the ReviewsList component
import { Container, Grid, Avatar, Typography, Button } from '@mui/material';

const User: React.FC = () => {
  // Sample user information
  const user = {
    name: 'John Doe',
    profilePhoto: 'https://source.unsplash.com/random',
    email: 'johndoe@example.com',
    password: 'example',
  };

  return (
    <>
      <HeaderMenu />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Left column for user information */}
          <Grid item xs={12} md={4}>
            <Avatar src={user.profilePhoto} sx={{ width: 150, height: 150, marginBottom: 2 }} />
            <Typography variant="h5" align="center" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {user.email}
            </Typography>

            {/* Buttons for editing user information */}
            <Button variant="outlined" fullWidth>
              Edit Name
            </Button>
            <Button variant="outlined" fullWidth>
              Change Profile Photo
            </Button>
            <Button variant="outlined" fullWidth>
              Change Email
            </Button>
            <Button variant="outlined" fullWidth>
              Change Password
            </Button>


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
