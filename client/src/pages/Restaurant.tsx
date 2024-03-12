import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, SwipeableDrawer, Typography, Fab, Grid, Paper, useTheme, useMediaQuery, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close'; // Importing Close icon
import ReviewList from '../components/ReviewList';
import HeaderMenu from "../components/HeaderMenu";
import { styled } from '@mui/material/styles';
import RestaurantContent from "../components/RestaurantContent";

const MainContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: 'calc(100vh - 64px)', // Adjust the height to consider the AppBar height if there is one
  overflowY: 'auto',
  backgroundColor: 'white', // Set background color to white
}));

const ReviewsContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: 'calc(100vh - 64px)', // Adjust the height to consider the AppBar height
  overflowY: 'auto',
  boxShadow: '-2px 0px 5px rgba(0, 0, 0, 0.2)', // This adds a drop shadow to the left side
  backgroundColor: theme.palette.grey[300], // Slightly darker background for the right column
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: 'auto',
  textAlign: 'center',
  height: '100vh',
  overflowY: 'auto',
  position: 'relative', // For the close button positioning
}));

const TitleTypography = styled(Typography)({
  fontFamily: 'monospace',
  fontWeight: 'bold',
});

const FloatingMenuButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

const Restaurant = () => {
  const { name } = useParams(); // This gets the ID from the route
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <HeaderMenu/>
      <Grid container spacing={0}> {/* Set spacing to 0 to remove padding between columns */}
        <Grid item xs={12} md={8}>
          <MainContent>
            <RestaurantContent name={name}/>
          </MainContent>
        </Grid>
        <Grid item md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
          <ReviewsContent>
            <TitleTypography variant="h4">Reviews</TitleTypography>
            <ReviewList name={name}/>
          </ReviewsContent>
        </Grid>
      </Grid>
      {isMobile && (
        <FloatingMenuButton color="primary" aria-label="open drawer" onClick={() => toggleDrawer(true)}>
          <MenuIcon />
        </FloatingMenuButton>
      )}
      <SwipeableDrawer anchor="bottom" open={drawerOpen} onClose={() => toggleDrawer(false)} onOpen={() => toggleDrawer(true)} ModalProps={{ keepMounted: true }}>
        <DrawerContent>
          <IconButton onClick={() => toggleDrawer(false)} style={{ position: 'absolute', right: 0, top: 0 }}>
            <CloseIcon />
          </IconButton>
          <TitleTypography variant="h5" style={{ paddingTop: '32px' }}> {/* Add padding to account for the close button */}
            Reviews
          </TitleTypography>
          <ReviewList name={name}/>
        </DrawerContent>
      </SwipeableDrawer>
    </>
  );
};

export default Restaurant;
