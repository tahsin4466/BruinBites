import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


function Search() {
  return (
    <>
        <div>
            <HeaderMenu/>
            <Typography variant="h4" align="center" mt={4} sx={{ fontFamily: 'monospace', fontWeight: 'bold'}} >Search Restaurants!</Typography>
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