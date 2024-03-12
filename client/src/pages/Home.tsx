import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';


function Home() {
  return (
    <>
      <Box style={{ height: '100vh', overflow: 'auto' }}>
        <Box style={{ position: 'fixed', width: '100%', zIndex: 1000 }}>
          <HeaderMenu />
        </Box>
        <Box p={2} mt={12}> {/* Add mt={12} to create space below the fixed header */}
          {/* title container! */}
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              {/* Left Column */}
              <Grid item xs={12} md={8}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h1" align="center" sx={{ fontFamily: 'monospace' }}>
                    Bruin Bites...
                  </Typography>
                  <Typography variant="h4" align="center" sx={{ fontFamily: 'monospace' }}>
                    Where you can explore diverse cuisines, discover hidden gems, and share your culinary adventures with fellow Bruins!
                  </Typography>
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2 }}>
                  <img src="https://via.placeholder.com/300?text=Image" alt="Image" style={{ width: '100%', height: 'auto' }} />
                </Box>
              </Grid>
            </Grid>
          </Container>

          {/* extra padding for the end*/}
          <Typography variant="body1" align="center" gutterBottom sx={{fontFamily: 'monospace'}}>
            ‎
          </Typography>
          <Typography variant="body1" align="center" gutterBottom sx={{fontFamily: 'monospace'}}>
            ‎
          </Typography>

          {/* Grid System for Main Points */}
          <Container maxWidth="lg">
            <Grid container spacing={2}>

              {/* First Grid Item */}
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
                  <Typography variant="h3" align="center" gutterBottom sx={{fontFamily: 'monospace'}}>
                    Search Restaurants!
                  </Typography>
                  <Typography variant="body1" align="center">
                    Some description for Text 1...
                  </Typography>
                </Paper>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 300 }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/1147/1147873.png" alt="Image 1" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </Paper>
              </Grid>

              {/* Second Grid Item */}
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
                  <Typography variant="h3" align="center" gutterBottom sx={{fontFamily: 'monospace'}}>
                    Write Reviews!
                  </Typography>
                  <Typography variant="body1" align="center">
                    Some description for Text 2...
                  </Typography>
                </Paper>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 300 }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3081/3081273.png" alt="Image 2" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </Paper>
              </Grid>
            </Grid>
          </Container>

          {/* SIGN UP THING */}
          <Typography variant="h1" align="center" sx={{mt: 8, fontFamily: 'monospace'}}>
            SIGN UP NOW!
          </Typography>
          {/* extra padding for the end*/}
          <Typography variant="body1" align="center" gutterBottom sx={{fontFamily: 'monospace'}}>
            ‎
          </Typography>
          <Typography variant="body1" align="center" gutterBottom sx={{fontFamily: 'monospace'}}>
            ‎
          </Typography>



        </Box>
      </Box>
    </>
);
}







export default Home;
