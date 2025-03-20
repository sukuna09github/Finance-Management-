import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

function SpendingAnalysis() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedBudgets, setSelectedBudgets] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const fetchBudgetsAndExpenses = async () => {
    try {
      const budgetsResponse = await fetch('http://localhost:9000/budgets');
      const budgetsData = await budgetsResponse.json();
      setBudgets(budgetsData);

      const expensesResponse = await fetch('http://localhost:9000/expenses');
      const expensesData = await expensesResponse.json();
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchBudgetsAndExpenses();
  }, []);

  const handleBudgetSelection = (event) => {
    const selectedBudgetId = parseInt(event.target.name);
    if (event.target.checked) {
      setSelectedBudgets([...selectedBudgets, selectedBudgetId]);
    } else {
      setSelectedBudgets(selectedBudgets.filter((id) => id !== selectedBudgetId));
    }
  };

  const handleExpenseSelection = (event) => {
    const selectedExpenseId = parseInt(event.target.name);
    if (event.target.checked) {
      setSelectedExpenses([...selectedExpenses, selectedExpenseId]);
    } else {
      setSelectedExpenses(selectedExpenses.filter((id) => id !== selectedExpenseId));
    }
  };

  const handleShowAnalysis = () => {
    if ((selectedBudgets.length === 0 && selectedExpenses.length === 0) || (selectedBudgets.length === 0 && selectedExpenses.length === 1) || (selectedBudgets.length === 1 && selectedExpenses.length === 0)) {
      setShowErrorDialog(true);
      return;
    }

    const selectedBudgetData = budgets.filter((budget) => selectedBudgets.includes(budget.id));
    const selectedExpenseData = expenses.filter((expense) => selectedExpenses.includes(expense.id));

    const labels = [];
    const budgetAmounts = [];
    const expenseAmounts = [];

    selectedBudgetData.forEach((budget) => {
      labels.push(budget.name);
      budgetAmounts.push(budget.amount);
      expenseAmounts.push(null);
    });

    selectedExpenseData.forEach((expense) => {
      labels.push(expense.name);
      expenseAmounts.push(expense.amount);
      budgetAmounts.push(null);
    });

    setChartData({
      labels,
      datasets: [
        { label: 'Budget', data: budgetAmounts, backgroundColor: 'blue' },
        { label: 'Expense', data: expenseAmounts, backgroundColor: 'red' },
      ],
    });
  };

  const handleCloseErrorDialog = () => setShowErrorDialog(false);

  return (
    <Box sx={{ py: { xs: 2, md: 10 }, px: 2, maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'black', mb: 4 }}>
        Spending Analysis (Multiple Items)
      </Typography>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', mb: 2 }}>
          Select Budgets
        </Typography>
        <Grid container spacing={1} justifyContent="center">
          {budgets.map((budget) => (
            <Grid item xs={12} sm={6} md={4} key={budget.id}>
              <FormControlLabel
                control={<Checkbox checked={selectedBudgets.includes(budget.id)} onChange={handleBudgetSelection} name={budget.id.toString()} />}
                label={`${budget.name} - Rs. ${budget.amount}`}
                sx={{ display: 'block', textAlign: 'center' }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', mb: 2 }}>
          Select Expenses
        </Typography>
        <Grid container spacing={1} justifyContent="center">
          {expenses.map((expense) => (
            <Grid item xs={12} sm={6} md={4} key={expense.id}>
              <FormControlLabel
                control={<Checkbox checked={selectedExpenses.includes(expense.id)} onChange={handleExpenseSelection} name={expense.id.toString()} />}
                label={`${expense.name} - Rs. ${expense.amount}`}
                sx={{ display: 'block', textAlign: 'center' }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Button
        sx={{ fontWeight: 'bold', fontSize: { xs: 16, md: 20 }, color: 'white', backgroundColor: '#343434', display: 'block', mx: 'auto', maxWidth: 600 }}
        variant="contained"
        onClick={handleShowAnalysis}
        fullWidth
      >
        Show Analysis
      </Button>

      <Dialog open={showErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent><DialogContentText>Please select at least one budget and expense to show the analysis.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={handleCloseErrorDialog} autoFocus>OK</Button></DialogActions>
      </Dialog>

      {chartData && (
        <Paper sx={{ p: 2, mt: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', mb: 2 }}>
            Budget vs Expense
          </Typography>
          <Box sx={{ maxWidth: { xs: '100%', md: 800 }, mx: 'auto' }}>
            <Bar
              data={chartData}
              options={{
                plugins: {
                  datalabels: {
                    display: true,
                    align: 'end',
                    anchor: 'end',
                    formatter: (value) => (value !== null ? `Rs. ${value}` : ''),
                    color: 'black',
                    font: { weight: 'bold', size: { xs: 12, md: 20 } },
                  },
                },
                scales: {
                  x: { ticks: { color: 'black', font: { weight: 'bold', size: { xs: 12, md: 20 } } } },
                  y: { ticks: { color: 'black', font: { weight: 'bold', size: { xs: 12, md: 20 } } } },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={400}
              plugins={[ChartDataLabels]}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default SpendingAnalysis;