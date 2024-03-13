// ReviewsListUser.tsx
import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import ReviewBox, { Review } from './ReviewBox';

const ReviewsListUser: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/userReviews');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data); // Set the fetched reviews to state
      } catch (error) {
        console.error("Could not fetch reviews:", error);
      }
    };

    fetchReviews();
  }, []);
  return (
    <Container maxWidth="md" sx={{ overflowY: 'auto', height: '90vh', py: 4 }}>
      <Grid container spacing={2}>
        {reviews.map((review, index) => (
          <Grid item key={index} xs={12}>
            <ReviewBox review={review} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ReviewsListUser;