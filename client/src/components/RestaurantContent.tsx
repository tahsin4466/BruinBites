import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Grid, Button, Dialog, IconButton, DialogTitle, DialogContent, DialogActions,
  TextField, Rating, Stack, Tab, Tabs
} from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CreateIcon from '@mui/icons-material/Create';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';

interface RestaurantContentProps {
  name: string | undefined;
}

interface RestaurantInfo {
  name: string;
  description: string;
}

interface MealPeriod {
  start: string;
  end: string;
}

interface RestaurantInfo {
  name: string;
  description: string;
}

interface RestaurantHours {
  [key: string]: MealPeriod;
}

interface MenuItem {
  name: string;
}

interface SubMenu {
  name: string;
  items: MenuItem[];
}

interface Menu {
  name: string;
  subMenus: SubMenu[];
}

const restaurantInfo: RestaurantInfo = {
  name: "Bruin Plate",
  description: "Dining venue at UCLA emphasizing health-oriented dishes made with local & sustainable ingredients."
}

const isCurrentTimeWithin = (start: string, end: string): boolean => {
  const currentTime = new Date();
  const startTime = new Date(currentTime);
  const endTime = new Date(currentTime);
  startTime.setHours(parseInt(start.split(':')[0]), parseInt(start.split(':')[1]), 0);
  endTime.setHours(parseInt(end.split(':')[0]), parseInt(end.split(':')[1]), 0);
  return currentTime >= startTime && currentTime <= endTime;
};

const findNextMealPeriod = (sortedMeals: [string, MealPeriod][]): { nextMeal: string; startTime: string } => {
  const currentTime = new Date();
  for (let [meal, {start}] of sortedMeals) {
    const mealStartTime = new Date();
    mealStartTime.setHours(parseInt(start.split(':')[0]), parseInt(start.split(':')[1]), 0);
    if (currentTime < mealStartTime) {
      return { nextMeal: meal, startTime: start };
    }
  }
  // If no future meal period is found, return the first meal period of the next day
  return { nextMeal: sortedMeals[0][0], startTime: sortedMeals[0][1].start };
};

const CombinedContent: React.FC<RestaurantContentProps> = ({ name }) => {
  const [restaurantImageUrls, setRestaurantImageUrls] = useState<string[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [selectedSubMenuIndex, setSelectedSubMenuIndex] = useState(0);
  const [restaurantHours, setRestaurantHours] = useState<RestaurantHours>({});
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [reviewImageFiles, setReviewImageFiles] = useState<File[]>([]);
  const [reviewImageUrls, setReviewImageUrls] = useState<string[]>([]);
  const [openGallery, setOpenGallery] = useState(false);
  const [review, setReview] = useState({ title: '', content: '', rating: 5 });
  const [currentMeal, setCurrentMeal] = useState<string>('');
  const [restaurantStatus, setRestaurantStatus] = useState<string>('Closed');
  const [nextOpeningTime, setNextOpeningTime] = useState<string>('');
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);


  // Async functions for fetching data

    const fetchReviewStatus = async () => {
    try {
      const response = await axios.get(`/api/checkReviewStatus/${name}`);
      setHasSubmittedReview(response.data.hasSubmitted); // Assuming the response contains a boolean indicating the status
      console.log("Checked if the user has submitted a review")
      console.log(hasSubmittedReview)
      console.log(response.data.hasSubmitted)
    } catch (error) {
      console.error('Error fetching review submission status:', error);
    }
  };


  const fetchMenus = async () => {
    const response = await fetch(`/api/menu/${name}`);
    const data = await response.json();
    console.log(data); // Log the fetched menu data
    setMenus(data.menus); // Make sure to access the `menus` property
    // Reset the selected menu and submenu indices to ensure they're within bounds
    setSelectedMenuIndex(0);
    setSelectedSubMenuIndex(0);
  };

  const fetchImages = async () => {
    const response = await fetch(`/api/restaurantImages/${name}`);
    const data = await response.json();
    setRestaurantImageUrls(data);
  };

  const fetchHours = async () => {
    const response = await fetch(`/api/hours/${name}`);
    const data = await response.json();
    setRestaurantHours(data);
  };

  const fetchInfo = async() => {
    const response = await fetch(`/api/restaurantInfo/${name}`);
    const data = await response.json();
    setRestaurantInfo(data); // Assuming data is an object
  };

  useEffect(() => {
    // Inside your useEffect for fetching data
    // Fetch data only once on component mount
    const initialize = async () => {
      await fetchReviewStatus();
      await fetchMenus();
      await fetchImages();
      await fetchHours();
      await fetchInfo();
    };
    initialize();
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Update restaurant status based on restaurantHours
    const updateStatusAndMeal = (hours: RestaurantHours) => {
      // Your existing logic for updating the status and meal...
      const currentTime = new Date();
      let foundCurrentMeal = false;
      let status = 'Closed';
      let nextOpening = '';

      // Sort the meals
      const sortedMeals = Object.entries(hours).sort((a, b) => {
        const aStart = parseInt(a[1].start.replace(':', ''), 10);
        const bStart = parseInt(b[1].start.replace(':', ''), 10);
        return aStart - bStart;
      });

      // Determine if the current time is within any meal period
      for (let [meal, {start, end}] of sortedMeals) {
        if (isCurrentTimeWithin(start, end)) {
          setCurrentMeal(meal);
          status = 'Open';
          foundCurrentMeal = true;
          break;
        }
      }

      // If no current meal period is found, find the next one
      if (!foundCurrentMeal) {
        const nextMealInfo = findNextMealPeriod(sortedMeals);
        setCurrentMeal('');
        nextOpening = `Closed. Opens at ${nextMealInfo.startTime} for ${nextMealInfo.nextMeal}`;
      }

      setRestaurantStatus(status);
      setNextOpeningTime(nextOpening);
    };

    if (Object.keys(restaurantHours).length > 0) {
      updateStatusAndMeal(restaurantHours);
    }

    const interval = setInterval(() => updateStatusAndMeal(restaurantHours), 60000); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, [restaurantHours]); // This effect depends on restaurantHours

  const handleOpenGallery = () => setOpenGallery(true);
  const handleCloseGallery = () => setOpenGallery(false);

  const handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReview({ ...review, [event.target.name]: event.target.value });
  };

  const handleRatingChange = (_: any, newValue: number | null) => {
    setReview({ ...review, rating: newValue ?? review.rating });
  };

  const handleReviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      setReviewImageFiles(prevFiles => [...prevFiles, ...filesArray]);

      // Cleanup old URLs before setting new ones
      cleanupImageUrls();

      const filesUrls = filesArray.map(file => URL.createObjectURL(file));
      setReviewImageUrls(prevUrls => [...prevUrls, ...filesUrls]);
    }
  };

  useEffect(() => {
  // Your existing useEffect logic here...

  return () => {
    // Cleanup URLs on component unmount
    cleanupImageUrls();
  };
}, []);

  const cleanupImageUrls = () => {
    reviewImageUrls.forEach(url => URL.revokeObjectURL(url));
  };

 const handleReviewSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('title', review.title);
  formData.append('content', review.content);
  formData.append('rating', review.rating.toString());
  console.log('Review files:', reviewImageFiles);
  reviewImageFiles.forEach((file) => {
    formData.append('images', file); // Append the file objects
  });
  for (let entry of (formData as any).entries()) {
    console.log(entry[0] + ', ' + entry[1]);
  }
  try {
    const response = await axios.post(`/api/reviewUpload/${name}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Review submitted successfully:', response.data);
    setHasSubmittedReview(true);
    // Handle the response here, possibly updating reviewImageUrls with the new URLs
  } catch (error) {
    console.error('Error submitting review:', error);
  }
};

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box p={2} sx={{ overflowY: 'auto' }}>

      {/* Updated restaurant status display */}
      <Typography align="left" variant="h2" style={{ fontWeight: 'bold', fontFamily: 'monospace' }} >
        {restaurantInfo?.name || 'Loading...'}
      </Typography>
      <Typography style={{ fontFamily: 'monospace', color: restaurantStatus === 'Open' ? 'green' : 'red' }} align="left" variant="h6" gutterBottom>
        {restaurantStatus === 'Open' ? `Open till ${restaurantHours[currentMeal]?.end} for ${currentMeal}` : nextOpeningTime}
      </Typography>

      <Typography align="left" variant="h5">
        {restaurantInfo?.description || 'Loading...'}
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <IconButton onClick={() => setSelectedMenuIndex(Math.max(selectedMenuIndex - 1, 0))}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
            {menus[selectedMenuIndex]?.name || 'Loading menus...'}
          </Typography>
          <IconButton onClick={() => setSelectedMenuIndex(Math.min(selectedMenuIndex + 1, menus.length - 1))}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        <Tabs
          value={selectedSubMenuIndex}
          onChange={(event, newValue) => setSelectedSubMenuIndex(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {menus[selectedMenuIndex]?.subMenus.map((submenu, index) => (
            <Tab label={submenu.name} key={index} />
          ))}
        </Tabs>

        {menus[selectedMenuIndex]?.subMenus[selectedSubMenuIndex]?.items.map((item, itemIndex) => (
          <Grid container spacing={2} key={itemIndex}>
            <Grid item xs={12}>
              <Typography sx={{p: 2}} align="left" variant="h6">
                <strong>{item.name}</strong>
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>

        {/* Hours Section */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Typography style={{ fontWeight: 'bold', fontFamily: 'monospace' }} variant="h4" gutterBottom>
              Today's Hours
            </Typography>
            {Object.entries(restaurantHours)
              .sort((a, b) => {
                // Split the 'start' string into hours and minutes, then convert to a number for comparison
                const aStart = parseInt(a[1].start.replace(':', ''), 10);
                const bStart = parseInt(b[1].start.replace(':', ''), 10);
                return aStart - bStart;
              })
              .map(([meal, { start, end }]) => (
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
        {
        hasSubmittedReview ? (
          <Box sx={{ flex: 1 }}>
            <Stack direction="column" alignItems="center" gap={1}>
            <Typography variant="h4" gutterBottom><strong>Thanks for leaving a review!</strong></Typography>
            <Typography variant="h5">Please come back tomorrow.</Typography>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mt: 2 }} />
            </Stack>
          </Box>
        ) : (
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
            )}
      </Box>
    </Box>
  );
};

export default CombinedContent;