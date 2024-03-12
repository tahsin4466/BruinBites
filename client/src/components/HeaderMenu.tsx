import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import InputBase from '@mui/material/InputBase';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


//Icon imports
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import IcecreamIcon from '@mui/icons-material/Icecream';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {useEffect, useState} from "react";


interface UserPFP {
  imageURL: string;
  loggedIn: string;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: 30,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const pages = ['Home', 'Dining', 'My Profile'];
const settings = ['Settings', 'Logout'];

function Logo() {
    let selector = Math.floor(Math.random() * 8);

    switch (selector) {
      case 0:
        return <FastfoodIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      case 1:
        return <EmojiFoodBeverageIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      case 2:
        return <DinnerDiningIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      case 3:
        return <IcecreamIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      case 4:
        return <RiceBowlIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      case 5:
        return <LocalPizzaIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      case 6:
        return <RamenDiningIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      case 7:
        return <BakeryDiningIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      default:
        return <RestaurantIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
    }
}

function ResponsiveAppBar() {
  const [userPFP, setUserPFP] = useState<UserPFP | null>(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate(); //to the top

  const fetchUserPFP = async() => {
    const response = await fetch('/api/userImage');
    const data = await response.json();
    setUserPFP(data); // Assuming data is an object
  };

  useEffect(() => {
    fetchUserPFP();
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  // Function to handle clicks on pages menu items
  const handlePageMenuItemClick = (page: string) => {
    handleCloseNavMenu(); // Close the menu after clicking a menu item
    console.log('Navigating to:', page);
    if (page === 'Home') {
      navigate('/');
    }
    else if (page === 'Dining') {
      navigate('/search')
    }
    else{
      navigate(`/${page.toLowerCase()}`); // Assuming the page routes follow the pattern '/<pagename>'
    }
  };

// Function to handle clicks on settings menu items
  const handleSettingMenuItemClick = (setting: string) => {
  console.log('handleMenuItemClick function called with setting:', setting);
  handleCloseUserMenu(); // Always close the menu after clicking a menu item
  if (setting === 'Logout') {
    console.log('Logging out...');
    // Call the backend API to log out, then navigate to the login page
    fetch('/api/logout', { method: 'POST' })
      .then(response => {
        if (response.ok) {
          navigate('/login'); // Navigate to login page after successful logout
        }
      })
      .catch(error => console.error('Error logging out:', error));
  } else if (setting === 'Profile') {
    console.log('to the profile!!');
    navigate('/profile'); // Invoke navigation to the profile page
  }
};

  return (
  <AppBar position="static">
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Logo />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Bruin Bites
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={() => handlePageMenuItemClick(page)}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Bruin Bites
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => handlePageMenuItemClick(page)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page}
            </Button>
          ))}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          {userPFP?.loggedIn === "true" ? (
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar src={userPFP?.imageURL || "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png?20091205084734"} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleSettingMenuItemClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);

}
export default ResponsiveAppBar;