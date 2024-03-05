import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';


function Search() {
  return (
    <>
        <div>
            <HeaderMenu/>
            <Typography variant="h4" align="center" mt={4} sx={{ fontFamily: 'monospace', fontWeight: 'bold'}} >Search Restaurants!</Typography>
            {/*Search box*/}
            <Box
              component="form"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                '& > :not(style)': { m: 1, width: '65%'},
              }}
              noValidate
              autoComplete="off"
            >
              <TextField id="outlined-basic" label="Search..." variant="outlined" fullWidth />
            </Box>
            {/* Results Box */}
            <Grid container spacing={2} justifyContent="center" mt={4}>
              {/* Dummy Data: Replace with actual data from API */}
              {[1, 2, 3].map((result) => (
                <Grid item key={result} xs={12} md={5.5} lg={5.5}>
                  <Card>
                      <CardContent>
                          {/* Placeholder content */}
                          <Typography variant="h6">Restaurant Name</Typography>
                          {/* Display review as stars */}
                          <Box component="fieldset" borderColor="transparent">
                              <Rating
                                  name="read-only"
                                  value={4.5} // Replace with the actual review value from API
                                  readOnly
                                  precision={0.5}
                                  emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                              />
                          </Box>
                          <Typography variant="body2">Description: "The sun slowly descended behind the horizon, casting
                              a warm glow over the tranquil sea."</Typography>
                          {/* Add photo here */}
                          <img src="https://via.placeholder.com/150" alt="Placeholder"/>
                      </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
        </div>
    </>
  );
}
export default Search;

/*
SEARCH
import React from 'react';
import HeaderMenu from '../components/HeaderMenu';

function Search() {
  return (
    <div>
      <HeaderMenu />
      <div className="search-container">
        <input type="text" placeholder="Search..." />
        <button type="submit">Search</button>
      </div>
    </div>
  );
}

export default Search;


 */

/*
TEXT FIELD
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function BasicTextFields() {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" />
    </Box>
  );
}
 */



/*
Display Review as stars
                  <Box component="fieldset" borderColor="transparent">
                    <Typography component="legend">Review:</Typography>
                    <Rating
                      name="read-only"
                      value={4.5} // Replace with the actual review value from API
                      readOnly
                      precision={0.5}
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                  </Box>

 */