import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Button, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

function SpendingAnalysis() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedExpense, setSelectedExpense] = useState('');
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

  const handleSelection = () => {
    if (!selectedBudget || !selectedExpense) {
      setShowErrorDialog(true);
      return;
    }

    const selectedBudgetData = budgets.find((budget) => budget.id === selectedBudget);
    const selectedExpenseData = expenses.find((expense) => expense.id === selectedExpense);

    if (selectedBudgetData && selectedExpenseData) {
      setChartData({
        labels: ['Selected Items'],
        datasets: [
          { label: 'Budget', data: [selectedBudgetData.amount], backgroundColor: 'dodgerblue' },
          { label: 'Expense', data: [selectedExpenseData.amount], backgroundColor: '#ED2939' },
        ],
      });
    }
  };

  const handleCloseErrorDialog = () => setShowErrorDialog(false);

  return (
    <Box sx={{ py: { xs: 2, md: 10 }, px: 2, maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'black', mb: 4 }}>
        Spending Analysis (2 Items)
      </Typography>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)', maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', mb: 2 }}>
          Select Budget and Expense
        </Typography>

        <TextField
          id="select-budget"
          select
          label="Select Budget"
          value={selectedBudget}
          onChange={(e) => setSelectedBudget(e.target.value)}
          fullWidth
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': { borderColor: '#C0C0C0' } }, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          {budgets.map((budget) => (
            <MenuItem key={budget.id} value={budget.id}>
              {budget.name} - Rs. {budget.amount}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="select-expense"
          select
          label="Select Expense"
          value={selectedExpense}
          onChange={(e) => setSelectedExpense(e.target.value)}
          fullWidth
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': { borderColor: '#C0C0C0' } }, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          {expenses.map((expense) => (
            <MenuItem key={expense.id} value={expense.id}>
              {expense.name} - Rs. {expense.amount}
            </MenuItem>
          ))}
        </TextField>

        <Button
          sx={{ fontWeight: 'bold', fontSize: { xs: 16, md: 20 }, color: 'white', backgroundColor: '#343434', display: 'block', mx: 'auto' }}
          variant="contained"
          onClick={handleSelection}
          fullWidth
        >
          Show Analysis
        </Button>
      </Paper>

      <Dialog open={showErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent><DialogContentText>Please select both a budget and an expense to show the analysis.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={handleCloseErrorDialog} autoFocus>OK</Button></DialogActions>
      </Dialog>

      {chartData && (
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', mb: 2 }}>
            Budget vs Expense
          </Typography>
          <Box sx={{ maxWidth: { xs: '100%', md: 600 }, mx: 'auto' }}>
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
                    font: { weight: 'bold', size: { xs: 14, md: 20 } },
                  },
                },
                scales: {
                  x: { ticks: { color: 'black', font: { weight: 'bold', size: { xs: 14, md: 20 } } } },
                  y: { ticks: { color: 'black', font: { weight: 'bold', size: { xs: 14, md: 20 } } } },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={300}
              plugins={[ChartDataLabels]}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default SpendingAnalysis;