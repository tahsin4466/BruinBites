// ReviewsList.tsx
import React from 'react';
import { Container, Grid } from '@mui/material';
import ReviewBox, { Review } from './ReviewBox';

const reviews: Review[] = [
  {
    title: "Delicious and Affordable",
    rating: 5,
    thumbnailUrls: [
      "https://portal.housing.ucla.edu/sites/default/files/media/images/Interior%20Greens%20and%20More%20Station%20Seating_square.png",
      "https://bruinplate.hh.ucla.edu/img/About_Facility1.jpg",
    ],
    userProfilePhoto: "https://example.com/user1.jpg",
    userName: "Alex Johnson",
    content: "I was pleasantly surprised by the quality of food offered at the campus dining hall. Great variety and everything tastes fresh. Definitely worth checking out!",
  },
  {
    title: "Good for a Quick Bite",
    rating: 4,
    thumbnailUrls: [
      "https://bruinplate.hh.ucla.edu/img/Home_NewFreshSlide.jpg",
      "https://i.insider.com/59f2479dcfad392f0d75597b?width=700",
      "https://s3-media0.fl.yelpcdn.com/bphoto/AH1o0Xj5aS_5LR9yIsSXRg/348s.jpg",
      "https://i.insider.com/59f2479dcfad392f0d75597d?width=800&format=jpeg&auto=webp", // This will trigger the pop-up to see more images
    ],
    userProfilePhoto: "https://example.com/user2.jpg",
    userName: "Bethany Miles",
    content: "It's my go-to place when I need something quick and tasty between classes. The snacks section is my favorite.",
  },
  {
    title: "Average Experience",
    rating: 3,
    userProfilePhoto: "https://example.com/user3.jpg",
    userName: "Charlie Smith",
    content: "It's okay if you're in a hurry, but don't expect too much. It gets the job done, though.",
  },
  {
    title: "Not Great",
    rating: 2,
    userProfilePhoto: "https://example.com/user4.jpg",
    userName: "Dana Lee",
    content: "", // Little to no review content
  },
  {
    title: "Disappointed",
    rating: 1,
    userProfilePhoto: "https://example.com/user5.jpg",
    userName: "Evan Wright",
    content: "The worst dining experience I've had on campus. I found a hair in my food, and the staff seemed indifferent when I complained. Will not be returning anytime soon.",
  },
  {
    title: "Excellent Variety",
    rating: 5,
    thumbnailUrls: [
      "https://i.insider.com/59f2479dcfad392f0d75597e?width=800&format=jpeg&auto=webp",
      "https://s3-media0.fl.yelpcdn.com/bphoto/8KxbxoUtL57Qp_C-SNg4tg/348s.jpg",
      "https://i.insider.com/59f2479ccfad392f0d755979?width=600&format=jpeg&auto=webp",
    ],
    userProfilePhoto: "https://example.com/user6.jpg",
    userName: "Fiona Graham",
    content: "The campus dining hall has a fantastic variety of foods to choose from. Whether you're vegan, vegetarian, or a meat-lover, there's something for everyone. Highly recommend the vegan options!",
  },
  {
    title: "Great for Vegetarians",
    rating: 4.5,
    thumbnailUrls: [
      "https://lh3.googleusercontent.com/proxy/hDnrJjz_DgSA2w80wvjj4j_1MkER_Jo26rCl_GEPzn_t3yV2ndcbqTQu-EAy_vxs27CD8tf4NHhebo6RRmi-x4S3rNVdGvlmWpbREqBIm61wsZQWRlnEHJ1dxQ106DN5e5YPgOWxj1LVDL82",
      "https://fastly.4sqi.net/img/general/600x600/12722721_lvjbKcQm3HmCz8s_iWeGv0HU5H4qlbLjxizwjioBgh8.jpg",
    ],
    userProfilePhoto: "https://example.com/user7.jpg",
    userName: "George Huang",
    content: "As a vegetarian, it's often hard to find good options on campus. However, the dining hall has a great selection that doesn't disappoint. The veggie burgers are a must-try!",
  }
];



const ReviewsList: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)', py: 4 }}>
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