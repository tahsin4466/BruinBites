import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import { Box, Typography } from '@mui/material';

function User() {
  return (
    <>
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <Box style={{ position: 'fixed', width: '100%', zIndex: 1000 }}>
        <HeaderMenu />
      </Box>
      <Box p={2} mt={4}> {/* Add mt={12} to create space below the fixed header */}
        <Typography variant="h4" align="center" mt={4}>
          User Profile
        </Typography>
        {/* Add user profile content here */}
      </Box>
    </div>
    </>
  );
}

export default User;
