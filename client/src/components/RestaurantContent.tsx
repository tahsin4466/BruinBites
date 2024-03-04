import React, { useState } from 'react';
import {
  Typography, Box, Grid, Button, Dialog, IconButton, DialogTitle, DialogContent, DialogActions,
  TextField, Rating, Stack // Ensure Stack is imported here
} from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CreateIcon from '@mui/icons-material/Create'; // Ensure CreateIcon is imported here
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const CombinedContent: React.FC = () => {
  // State for the original restaurant images
  const [restaurantImageUrls, setRestaurantImageUrls] = useState<string[]>([
    'https://source.unsplash.com/collection/827743/1',
    'https://source.unsplash.com/collection/827743/2',
    'https://source.unsplash.com/collection/827743/3',
  ]);

  // State for the review images
  const [reviewImageUrls, setReviewImageUrls] = useState<string[]>([]);
  const [openGallery, setOpenGallery] = useState(false);
  const [review, setReview] = useState({ title: '', content: '', rating: 2 });

  const handleOpenGallery = () => setOpenGallery(true);
  const handleCloseGallery = () => setOpenGallery(false);

  const handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReview({ ...review, [event.target.name]: event.target.value });
  };

  const handleRatingChange = (_: any, newValue: number | null) => {
    setReview({ ...review, rating: newValue ?? review.rating });
  };

  const handleReviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newImageUrl = URL.createObjectURL(event.target.files[0]);
      setReviewImageUrls([...reviewImageUrls, newImageUrl]);
    }
  };

  const handleReviewSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Submission logic goes here
  };

  return (
    <Box p={2} sx={{ overflowY: 'auto' }}>

      {/* ... other components ... */}

      <Typography align="left" variant="h2" style={{ fontWeight: 'bold', fontFamily: 'monospace' }} >
        Bruin Plate
      </Typography>
      <Typography style={{ fontFamily: 'monospace'}} align="left" variant="h6" gutterBottom>Closed. Opens 5pm</Typography>
      <Typography align="left" variant="h5">
        Dining venue at UCLA emphasizing health-oriented dishes made with local & sustainable ingredients
      </Typography>
      <Typography variant="h5">‎</Typography>
      {/* Thumbnails and button to open gallery */}
      <Grid container spacing={2} justifyContent="space-between" alignItems="center" sx={{ width: '100%', marginBottom: '16px' }}>
        {restaurantImageUrls.slice(0, 3).map((url, index) => (
          <Grid item xs key={index} sx={{ maxWidth: 'calc(33.3333% - 16px)' }}>
            <img
              src={url}
              alt={`Thumbnail ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', aspectRatio: '1 / 1' }}
            />
          </Grid>
        ))}
        <Grid item>
          <IconButton onClick={handleOpenGallery} style={{ borderRadius: '50%' }}>
            <PhotoLibraryIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* Gallery Dialog */}
      <Dialog
        open={openGallery}
        onClose={handleCloseGallery}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>All Images</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {restaurantImageUrls.map((url, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <img
                  src={url}
                  alt={`Gallery Image ${index + 1}`}
                  style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'contain' }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGallery} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

        {/* Grid container with adjusted spacing and flexWrap */}
      <Grid container spacing={2}>
        {/* Menu Section taking up twice as much space as the Hours section on desktop */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              p: 2,
              boxShadow: 3,
              borderRadius: '40px',
              marginBottom: { xs: 2, md: 0 }, // Adjust bottom margin for responsiveness
            }}
          >
            <Typography style={{ fontWeight: 'bold', fontFamily: 'monospace' }} variant="h4" gutterBottom>
              Menu
            </Typography>
            <Typography paragraph>This is placeholder content for the menu.</Typography>
          </Box>
        </Grid>

        {/* Hours Section */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 2,
              boxShadow: 3,
              borderRadius: '40px',
            }}
          >
            <Typography style={{ fontWeight: 'bold', fontFamily: 'monospace' }} variant="h4" gutterBottom>
              Hours
            </Typography>
            <Typography variant="h6"><strong>Monday: </strong>7am - 9pm</Typography>
            <Typography variant="h6"><strong>Tuesday: </strong>7am - 9pm</Typography>
            <Typography variant="h6"><strong>Wednesday: </strong>7am - 9pm</Typography>
            <Typography variant="h6"><strong>Thursday: </strong>7am - 9pm</Typography>
            <Typography variant="h6"><strong>Friday: </strong>7am - 9pm</Typography>
            <Typography variant="h6"><strong>Saturday: </strong>7am - 9pm</Typography>
            <Typography variant="h6"><strong>Sunday: </strong>7am - 9pm</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Additional space */}
      <Box mt={2} />

      {/* "Write a review" section */}
      <Box sx={{
        display: 'flex',
        boxShadow: 3,
        borderRadius: '40px',
        p: 2,
        mb: 4,
        backgroundColor: '#fff',
      }}>
        <Box sx={{ mr: 2 }}>
          <CreateIcon color="primary" sx={{ fontSize: '5rem' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
            Write a Review!
          </Typography>
          <Typography paragraph sx={{ mb: 2 }}>
            Tell us your thoughts about this place.
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Rating
              name="rating"
              value={review.rating}
              onChange={handleRatingChange}
              size="large"
              sx={{ mb: 2 }} // Maintain spacing below the rating
            />
            <IconButton color="primary" component="label">
              <AddAPhotoIcon />
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/gif"
                onChange={handleReviewImageChange}
              />
            </IconButton>
          </Stack>
          <Box component="form" onSubmit={handleReviewSubmit} noValidate sx={{ width: '100%' }}>
            <TextField
              name="title"
              label="Review Title"
              value={review.title}
              onChange={handleReviewChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              name="content"
              label="Your Review"
              value={review.content}
              onChange={handleReviewChange}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit Review
            </Button>
          </Box>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {reviewImageUrls.map((url, index) => (
              <Grid item key={index}>
                <img
                  src={url}
                  alt={`Review Image ${index + 1}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

    </Box>
  );
};

export default CombinedContent;
