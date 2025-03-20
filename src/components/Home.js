import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import budgetImg from '../assets/budget.jpg';
import expenseImg from '../assets/expense.jpg';
import analysis2Img from '../assets/analysis.jpg';
import analysisMultiImg from '../assets/analysis.jpg';

const Home = () => {
  const pages = [
    { title: 'Budget Management', path: '/budget-management', image: budgetImg },
    { title: 'Expense Tracking and Recording', path: '/expense-tracking-and-recording', image: expenseImg },
    { title: 'Spending Analysis (2 Items)', path: '/spending-analysis-(2-items)', image: analysis2Img },
    { title: 'Spending Analysis (Multiple Items)', path: '/spending-analysis-(multiple-items)', image: analysisMultiImg },
  ];

  return (
    <Box sx={{ py: { xs: 2, md: 10 }, px: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {pages.map((page) => (
          <Grid item xs={12} sm={6} md={3} key={page.title}>
            <Link to={page.path} style={{ textDecoration: 'none' }}>
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="150"
                    image={page.image}
                    alt={page.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2' }}>
                      {page.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;