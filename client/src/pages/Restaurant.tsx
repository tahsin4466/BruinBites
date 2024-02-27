import React, { useState } from 'react';
import { Box, SwipeableDrawer, Typography, Tab, Tabs, AppBar, Toolbar, Fab, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ReviewList from '../components/ReviewList'; // Adjust import path as necessary
import HeaderMenu from "../components/HeaderMenu";
import { styled } from '@mui/material/styles';

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main, // Changed color for contrast
}));

const TabsContainer = styled('div')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MainContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: '100vh', // Full viewport height
  overflowY: 'auto',
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: 'auto',
  textAlign: 'center',
  height: '100vh', // Full screen height for mobile
  overflowY: 'auto',
}));

const TitleTypography = styled(Typography)({
  fontFamily: 'monospace', // Monospace font for titles
  fontWeight: 'bold',
});

const FloatingMenuButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

const Restaurant = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <HeaderMenu />
      <AppBarStyled position="static">
        <Toolbar>
          <TitleTypography variant="h5">Restaurant Info</TitleTypography>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="Restaurant info tabs" textColor="inherit" indicatorColor="secondary" sx={{ marginLeft: 'auto' }}>
            <Tab label="Info" />
            <Tab label="Menu" />
            <Tab label="Hours" />
            <Tab label="Pictures" />
          </Tabs>
        </Toolbar>
      </AppBarStyled>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <MainContent>
            {/* Content based on tabValue */}
          </MainContent>
        </Grid>
        <Grid item md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
          <MainContent>
            <TitleTypography variant="h5">Reviews</TitleTypography>
            <ReviewList />
          </MainContent>
        </Grid>
      </Grid>
      {isMobile && (
        <FloatingMenuButton color="primary" aria-label="open drawer" onClick={() => toggleDrawer(true)}>
          <MenuIcon />
        </FloatingMenuButton>
      )}
      <SwipeableDrawer anchor="bottom" open={drawerOpen} onClose={() => toggleDrawer(false)} onOpen={() => toggleDrawer(true)} ModalProps={{ keepMounted: true }}>
        <DrawerContent>
          <TitleTypography variant="h5" style={{ position: 'sticky', top: 0, backgroundColor: theme.palette.background.paper, zIndex: 1, textAlign: 'center' }}>
            Reviews
          </TitleTypography>
          <ReviewList />
        </DrawerContent>
      </SwipeableDrawer>
    </>
  );
};

export default Restaurant;
