import React, { useState, useEffect } from 'react';
import HeaderMenu from '../components/HeaderMenu';
import ReviewsListSearchedUser from '../components/ReviewListSearchedUser';
import {
  Container, Grid, Avatar, Typography, Drawer, IconButton, Fab, Box,
  useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {useParams} from "react-router-dom";

const SearchedUser: React.FC = () => {
  const { id } = useParams(); // This gets the ID from the route
  const [firstName, setFirstName] = useState('Loading...');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('Loading...');
  const [date, setDate] = useState('Loading...');
  const [drawerOpen, setDrawerOpen] = useState(false);
  // New state for file upload and preview
  const [previewUrl, setPreviewUrl] = useState<string | null>("https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png?20091205084734");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/searchedInfo/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming your API returns a full name, split it for first and last name fields
        const [first, ...last] = data.name.split(' ');
        setFirstName(first);
        setLastName(last.join(' ')); // Join the rest back in case there are multiple parts to the last name
        setEmail(data.email);
        setDate(data.date)
        if (data.userPFP) {
          setPreviewUrl(data.userPFP);
        }
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
              <Typography variant="body2" align="center" gutterBottom sx={{ fontFamily: 'monospace' }}>
                Member since {date}
              </Typography>
              <Typography variant="h5">‎</Typography>
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
              <ReviewsListSearchedUser id={id}/>
            </div>
          </Drawer>

          {!isMobile && (
            <Grid item xs={12} md={8}>
              <Typography align="center" style={{fontWeight: 'bold', fontFamily: 'monospace'}} variant="h5">{`${firstName}`}'s Past Reviews</Typography>
              <ReviewsListSearchedUser id={id}/>
            </Grid>
          )}
        </Grid>
      </Container>
    </>

  );
};


export default SearchedUser;
