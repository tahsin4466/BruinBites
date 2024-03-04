import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Grid, Button, Dialog, IconButton, DialogTitle, DialogContent, DialogActions,
  TextField, Rating, Stack, Tab, Tabs
} from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CreateIcon from '@mui/icons-material/Create';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

interface MealPeriod {
  start: string;
  end: string;
}

interface RestaurantHours {
  [key: string]: MealPeriod;
}

interface MenuItem {
  name: string;
  price: string;
}

interface SubMenu {
  name: string;
  items: MenuItem[];
}

const subMenus: SubMenu[] = [
  {
    name: "Starters",
    items: [
      { name: "Soup of the day", price: "$5" },
      { name: "Bruschetta", price: "$7" },
      // ... other starters
    ],
  },
  {
    name: "Main Courses",
    items: [
      { name: "Steak", price: "$20" },
      { name: "Salmon", price: "$18" },
      // ... other main courses
    ],
  },
  {
    name: "Main Courses",
    items: [
      { name: "Steak", price: "$20" },
      { name: "Salmon", price: "$18" },
      // ... other main courses
    ],
  },
    {
    name: "Main Courses",
    items: [
      { name: "Steak", price: "$20" },
      { name: "Salmon", price: "$18" },
      // ... other main courses
    ],
  },
];

const restaurantHours: RestaurantHours = {
  "Breakfast": {"start": "08:00", "end": "11:00"},
  "Lunch": {"start": "12:00", "end": "14:00"},
  "Dinner": {"start": "18:00", "end": "21:00"},
  "Late Hours": {"start": "22:00", "end": "24:00"}
};

const isCurrentTimeWithin = (start: string, end: string): boolean => {
  const currentTime = new Date();
  const startTime = new Date(currentTime);
  const endTime = new Date(currentTime);
  startTime.setHours(parseInt(start.split(':')[0]), parseInt(start.split(':')[1]), 0);
  endTime.setHours(parseInt(end.split(':')[0]), parseInt(end.split(':')[1]), 0);
  return currentTime >= startTime && currentTime <= endTime;
};

const findNextMealPeriod = (): { nextMeal: string; startTime: string } => {
  const currentTime = new Date();
  const sortedMeals = Object.entries(restaurantHours).sort((a, b) => {
    const aStart = a[1].start.split(':');
    const bStart = b[1].start.split(':');
    return new Date().setHours(parseInt(aStart[0]), parseInt(aStart[1])) - new Date().setHours(parseInt(bStart[0]), parseInt(bStart[1]));
  });
  for (let [meal, {start}] of sortedMeals) {
    const mealStartTime = new Date();
    mealStartTime.setHours(parseInt(start.split(':')[0]), parseInt(start.split(':')[1]), 0);
    if (currentTime < mealStartTime) {
      return { nextMeal: meal, startTime: start };
    }
  }
  return { nextMeal: sortedMeals[0][0], startTime: sortedMeals[0][1].start };
};

const CombinedContent: React.FC = () => {
  const [restaurantImageUrls, setRestaurantImageUrls] = useState<string[]>([
    'https://source.unsplash.com/collection/827743/1',
    'https://source.unsplash.com/collection/827743/2',
    'https://source.unsplash.com/collection/827743/3',
      'https://source.unsplash.com/collection/827743/4',
      'https://source.unsplash.com/collection/827743/5',
      'https://source.unsplash.com/collection/827743/6',
      'https://source.unsplash.com/collection/827743/7',
      'https://source.unsplash.com/collection/827743/8',
      'https://source.unsplash.com/collection/827743/9',
      'https://source.unsplash.com/collection/827743/10',
      'https://source.unsplash.com/collection/827743/11',
  ]);

  const [reviewImageUrls, setReviewImageUrls] = useState<string[]>([]);
  const [openGallery, setOpenGallery] = useState(false);
  const [review, setReview] = useState({ title: '', content: '', rating: 2 });
  const [currentMeal, setCurrentMeal] = useState<string>('');
  const [restaurantStatus, setRestaurantStatus] = useState<string>('Closed');
  const [nextOpeningTime, setNextOpeningTime] = useState<string>('');

  useEffect(() => {
    const updateStatusAndMeal = () => {
      let foundCurrentMeal = false;
      let status = 'Closed';
      let nextOpening = '';

      Object.entries(restaurantHours).forEach(([meal, { start, end }]) => {
        if (isCurrentTimeWithin(start, end)) {
          setCurrentMeal(meal);
          status = 'Open';
          foundCurrentMeal = true;
        }
      });

      if (!foundCurrentMeal) {
        const nextMealInfo = findNextMealPeriod();
        setCurrentMeal('');
        nextOpening = `Closed. Opens at ${nextMealInfo.startTime} for ${nextMealInfo.nextMeal}`;
      }

      setRestaurantStatus(status);
      setNextOpeningTime(nextOpening);
    };

    updateStatusAndMeal();
    const interval = setInterval(updateStatusAndMeal, 60000);

    return () => clearInterval(interval);
  }, []);

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

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box p={2} sx={{ overflowY: 'auto' }}>

      {/* Updated restaurant status display */}
      <Typography align="left" variant="h2" style={{ fontWeight: 'bold', fontFamily: 'monospace' }} >
        Bruin Plate
      </Typography>
      <Typography style={{ fontFamily: 'monospace', color: restaurantStatus === 'Open' ? 'green' : 'red' }} align="left" variant="h6" gutterBottom>
        {restaurantStatus === 'Open' ? `Open till ${restaurantHours[currentMeal]?.end} for ${currentMeal}` : nextOpeningTime}
      </Typography>

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
        <DialogTitle style={{fontFamily: 'monospace'}}><strong>All User Images</strong></DialogTitle>
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
        {/* Menu Section with tabs */}
      <Grid item xs={12} md={7}>
        <Box
          sx={{
            p: 2,
            boxShadow: 3,
            borderRadius: '40px',
            marginBottom: { xs: 2, md: 0 },
          }}
        >
          <Typography style={{ fontWeight: 'bold', fontFamily: 'monospace' }} variant="h4" gutterBottom>
            Menu
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {subMenus.map((submenu, index) => (
              <Tab label={submenu.name} key={index} />
            ))}
          </Tabs>
          {subMenus.map((submenu, index) => (
            <Box
              role="tabpanel"
              hidden={selectedTab !== index}
              key={index}
              sx={{ paddingTop: '16px' }}
            >
              {selectedTab === index && (
                <Grid container spacing={2}>
                  {submenu.items.map((item, itemIndex) => (
                    <Grid item xs={12} key={itemIndex}>
                      <Typography sx={{p: 2}} align="left" variant="h6"><strong>{item.name}</strong> - {item.price}</Typography>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          ))}
        </Box>
      </Grid>

        {/* Hours Section */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              p: 2,
              boxShadow: 3,
              borderRadius: '40px',
            }}
          >
            <Typography style={{ fontWeight: 'bold', fontFamily: 'monospace' }} variant="h4" gutterBottom>
              Today's Hours
            </Typography>
            {Object.entries(restaurantHours).map(([meal, { start, end }]) => (
              <Typography
                variant="h6"
                key={meal}
                style={{
                  color: currentMeal === meal ? '#4caf50' : 'inherit', // Highlight current meal in green
                }}
              >
                <strong>{meal}: </strong>{start} - {end}
              </Typography>
            ))}
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
