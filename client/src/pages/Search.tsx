import HeaderMenu from '../components/HeaderMenu';
import { Box, Typography, TextField, Grid, Card, CardContent } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import {useNavigate} from "react-router-dom";

interface Restaurant {
  image: string;
  name: string;
  review: number;
  description: string;
}

function Search() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate(); //to the top

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/restaurantResults'); // Replace with your Flask API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRestaurants(data); // Assuming the API returns an array of restaurant objects
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const options = {
      keys: ['name', 'description'],
    };

    const fuse = new Fuse(restaurants, options);
    const results = searchTerm ? fuse.search(searchTerm) : restaurants.map(restaurant => ({ item: restaurant }));
    // @ts-ignore
    const isFuseResult = (result: any): result is Fuse.FuseResult<Restaurant> => result.item !== undefined;
    const matches = results.map(result => isFuseResult(result) ? result.item : result);
    setFilteredRestaurants(matches);
  }, [searchTerm, restaurants]); // Depend on searchTerm and restaurants


  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <Box style={{ position: 'fixed', width: '100%', zIndex: 1000 }}>
        <HeaderMenu />
      </Box>
      <Box p={2} mt={12}> {/* Add mt={12} to create space below the fixed header */}
        <Typography variant="h4" align="center" mt={4} sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
          Search Restaurants
        </Typography>
        {/* Search box */}
       <Box
        component="form"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          '& > :not(style)': { m: 1, width: '65%' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()} // Prevent form submission on Enter
      >
           <TextField
          id="outlined-basic"
          label="I want to eat at..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Set search term on input change
        />
        </Box>
        {/* Results Box */}
        <Grid container spacing={2} justifyContent="center" mt={4}>
          {filteredRestaurants.map((restaurant, index) => (
            <Grid item key={index} xs={12} md={5.5} lg={5.5}>
              <Card onClick={() => navigate(`/restaurant/${restaurant.name}`)} style={{ cursor: 'pointer' }}>
                <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Restaurant image */}
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    style={{ width: '150px', height: '150px', objectFit: 'cover', marginRight: '1rem' }}
                  />
                  <div>
                    {/* Restaurant Name */}
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 'bold' }} variant="h5">{restaurant.name}</Typography>
                    {/* Display review as stars */}
                    <Box component="fieldset" borderColor="transparent">
                      <Rating
                        name="read-only"
                        value={restaurant.review}
                        readOnly
                        precision={0.5}
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                      />
                    </Box>
                    {/* Description */}
                    <Typography variant="body2">{restaurant.description}</Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default Search;
