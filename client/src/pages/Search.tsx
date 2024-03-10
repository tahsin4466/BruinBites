import React, { useState } from 'react';
import HeaderMenu from '../components/HeaderMenu';
import { Box, Typography, TextField, Grid, Card, CardContent } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse'; // Import Collapse component
import { IconButton } from '@mui/material';


// Define an array of restaurant objects with image, name, review, and description properties
const restaurants = [
  {
    image: 'https://source.unsplash.com/random', // random
    name: 'Restaurant 2',
    review: 3.8,
    description: 'Description of Restaurant 2',
  },
  {
    image: 'https://source.unsplash.com/random', // random
    name: 'Restaurant 3',
    review: 4.2,
    description: 'Description of Restaurant 3',
  },
  {
    image: 'https://source.unsplash.com/random', // random
    name: 'Restaurant 4',
    review: 4.0,
    description: 'Description of Restaurant 4',
  },
  {
    image: 'https://source.unsplash.com/random', // random
    name: 'Restaurant 5',
    review: 4.7,
    description: 'Description of Restaurant 5',
  },

  {
    image: 'https://source.unsplash.com/random', // random
    name: 'Restaurant Rando',
    review: 3.8,
    description: 'Description of Restaurant Rando',
  },
];



function Search() {
  const [expanded, setExpanded] = useState(-1);

  const handleExpand = (index: number) => {
    setExpanded((prevExpanded) => (prevExpanded === index ? -1 : index));
  };


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
        >
          <TextField id="outlined-basic" label="I want to eat at..." variant="outlined" fullWidth />
        </Box>
        {/* Results Box */}
        <Grid container spacing={2} justifyContent="center" mt={4}>
          {restaurants.map((restaurant, index) => (
            <Grid item key={index} xs={12} md={5.5} lg={5.5}>
              <Card>
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
