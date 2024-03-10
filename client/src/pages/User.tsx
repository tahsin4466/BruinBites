import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import ReviewsList from '../components/ReviewList'; // Import the ReviewsList component
import { Container, Grid, Avatar, Typography } from '@mui/material';

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
