import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Button from '@mui/material/Button';







function Home() {

  const navigate = useNavigate(); //to the top

  const handleLoginButtonClick = () => {
    console.log('Navigating to login page');
    navigate('/login');
  };


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
                <Box sx={{p: 2}}>
                  <Typography variant="h1" align="center" sx={{fontFamily: 'monospace', fontWeight: 'bold'}}>
                    Bruin Bites...
                  </Typography>
                  <Typography variant="h4" align="center" sx={{fontFamily: 'monospace'}}>
                    Where you can explore diverse cuisines, discover hidden gems, and share your culinary adventures
                    with fellow Bruins!
                  </Typography>
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={4}>
                <Box sx={{p: 2}}>
                  <img
                      src="https://external-preview.redd.it/5QGOArDrThkUYTDoeydRH1fFJIauzs6xLkywH95Bnu8.jpg?auto=webp&s=273036c064cc1ed2d9793dc184731ec9618a7cd4"
                      alt="Image" style={{width: '100%', height: 'auto'}}/>
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
              <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row'}}>
                <Paper elevation={3} sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                  <Typography variant="h3" align="center" gutterBottom sx={{fontFamily: 'monospace'}}>
                    Search Restaurants!
                  </Typography>
                  <Typography variant="body1" align="center">
                    Discover your next culinary adventure with our intuitive restaurant search feature. From cozy cafes
                    to fine dining destinations, explore a world of flavors right at your fingertips.
                  </Typography>
                </Paper>
                <Paper elevation={3} sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 300
                }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/1147/1147873.png" alt="Image 1"
                       style={{maxWidth: '100%', maxHeight: '100%'}}/>
                </Paper>
              </Grid>

              {/* Second Grid Item */}
              <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row-reverse'}}>
                <Paper elevation={3} sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                  <Typography variant="h3" align="center" gutterBottom sx={{fontFamily: 'monospace'}}>
                    Write Reviews!
                  </Typography>
                  <Typography variant="body1" align="center">
                    Share your dining experiences and insights effortlessly through our easy-to-use review platform.
                    Help fellow food enthusiasts find hidden gems and make informed decisions with your valuable
                    feedback.
                  </Typography>
                </Paper>
                <Paper elevation={3} sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 300
                }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3081/3081273.png" alt="Image 2"
                       style={{maxWidth: '100%', maxHeight: '100%'}}/>
                </Paper>
              </Grid>
            </Grid>
          </Container>

          {/* SIGN UP THING */}
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button onClick={handleLoginButtonClick} sx={{mt: 8, fontFamily: 'monospace'}}>
              <Typography variant="h1">
                SIGN UP NOW!
              </Typography>
            </Button>
          </div>


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
