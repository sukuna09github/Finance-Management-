import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import './App.css';
import Appbar from './components/Appbar';
import BudgetManagement from './components/Budget-Management';
import ExpenseTrackingAndRecording from './components/Expense-Tracking-and-Recording';
import SPENDING_ANALYSIS_2_ITEMS from './components/Spending-Analysis-(2-Items)';
import SPENDING_ANALYSIS_MULTIPLE_ITEMS from './components/Spending-Analysis-(Multiple-Items)';
import Home from './components/Home';
import background from './assets/background.jpg';
import Footer from './components/Footer';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const useStyles = makeStyles({
  root: {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative', // For overlay
    '&::before': { // Overlay
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light layer
      zIndex: 0,
    },
  },
  content: {
    flex: 1, // Pushes footer to bottom
    position: 'relative', // Ensure content stays above overlay
    zIndex: 1,
  },
});

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className={classes.root}>
          <Appbar />
          <div className={classes.content}>
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/budget-management" element={<BudgetManagement />} />
                <Route path="/expense-tracking-and-recording" element={<ExpenseTrackingAndRecording />} />
                <Route path="/spending-analysis-(2-items)" element={<SPENDING_ANALYSIS_2_ITEMS />} />
                <Route path="/spending-analysis-(multiple-items)" element={<SPENDING_ANALYSIS_MULTIPLE_ITEMS />} />
              </Routes>
            </Container>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;