// ReviewBox.tsx
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Rating, Modal, Grid, IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link as RouterLink } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export interface Review {
  title: string;
  rating: number;
  thumbnailUrls?: string[];
  userProfilePhoto: string;
  userName: string;
  content: string;
  date: string;
  userID: number;
}

const ImageGalleryModal: React.FC<{ images: string[]; open: boolean; onClose: () => void }> = ({
  images,
  open,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ position: 'relative', width: 'auto', height: 'auto', outline: 'none', maxWidth: '90vw', maxHeight: '90vh', overflow: 'hidden', bgcolor: 'background.paper', borderRadius: 2 }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'black', zIndex: 10 }}>
          <CloseIcon />
        </IconButton>
        <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'black', zIndex: 10 }}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'black', zIndex: 10 }}>
          <ArrowForwardIosIcon />
        </IconButton>
        <img src={images[currentIndex]} alt={`Review Image ${currentIndex}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', margin: 'auto', display: 'block' }} />
      </Box>
    </Modal>
  );
};

const ReviewBox: React.FC<{ review: Review }> = ({ review }) => {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <Card sx={{ minWidth: 275, mb: 2, boxShadow: 3, backgroundColor: '#f9f9f9' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={review.userProfilePhoto} sx={{ mr: 2 }} />
          <RouterLink to={`/profile/${review.userID}`} style={{ textDecoration: 'none' }}>
          <Typography variant="h5" component="div" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#333' }}>
            {review.userName}
          </Typography>
          </RouterLink>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating name="read-only" value={review.rating} readOnly />
          <Typography sx={{ ml: 2, fontSize: '1.1rem', color: '#555', fontFamily: 'monospace'}}>
            {review.title}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ textAlign: 'left', mb: 2, color: '#666' }}>
          <strong>{review.date}</strong>
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'left', mb: 2, color: '#666' }}>
          {review.content}
        </Typography>
        {review.thumbnailUrls && review.thumbnailUrls.length > 0 && (
          <Grid container spacing={1}>
            {review.thumbnailUrls.slice(0, 3).map((url, index) => (
              <Grid item key={index}>
                <img src={url} alt={`Thumbnail ${index}`} style={{ width: 50, height: 50, cursor: 'pointer' }} onClick={() => setGalleryOpen(true)} />
              </Grid>
            ))}
            {review.thumbnailUrls.length > 3 && (
              <Grid item>
                <IconButton onClick={() => setGalleryOpen(true)} sx={{ color: '#777' }}>
                  <MoreHorizIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        )}
      </CardContent>
      <ImageGalleryModal images={review.thumbnailUrls || []} open={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </Card>
  );
};

export default ReviewBox;