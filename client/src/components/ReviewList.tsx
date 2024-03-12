import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import ReviewBox, { Review } from './ReviewBox';

interface ReviewListProps {
  name: string | undefined;
}

const ReviewsList: React.FC<ReviewListProps> = ({ name }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
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

export default ReviewsList;
