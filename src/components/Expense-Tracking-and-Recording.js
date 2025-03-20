import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function ExpenseManagement() {
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [errors, setErrors] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openCustomCategoryDialog, setOpenCustomCategoryDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:9000/expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:9000/budget-categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!expenseName.trim()) errors.expenseName = 'Expense Name is required';
    if (!expenseAmount.trim()) errors.expenseAmount = 'Expense Amount is required';
    else if (isNaN(expenseAmount)) errors.expenseAmount = 'Expense Amount must be a number';
    if (!expenseCategory.trim()) errors.expenseCategory = 'Expense Category is required';
    if (!expenseDate.trim()) errors.expenseDate = 'Expense Date is required';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const response = await fetch('http://localhost:9000/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: expenseName, amount: parseFloat(expenseAmount), category: expenseCategory, date: expenseDate }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to save expense. Please try again later.');
      setOpenErrorDialog(true);
      return;
    }

    fetchExpenses();
    setExpenseName('');
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseDate('');
    setErrors({});
    setDialogMessage('Expense saved successfully');
    setOpenSuccessDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    const response = await fetch(`http://localhost:9000/expenses/${expenseToDelete}`, { method: 'DELETE' });
    if (!response.ok) {
      setDialogMessage('Failed to delete expense. Please try again later.');
      setOpenErrorDialog(true);
      setOpenDeleteDialog(false);
      return;
    }
    fetchExpenses();
    setOpenDeleteDialog(false);
    setDialogMessage('Expense deleted successfully');
    setOpenSuccessDialog(true);
  };

  const handleConfirmEdit = async () => {
    if (!expenseToEdit) return;
    const response = await fetch(`http://localhost:9000/expenses/${expenseToEdit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: expenseName, amount: parseFloat(expenseAmount), category: expenseCategory, date: expenseDate }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to edit expense. Please try again later.');
      setOpenErrorDialog(true);
      setOpenEditDialog(false);
      return;
    }

    fetchExpenses();
    setExpenseName('');
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseDate('');
    setErrors({});
    setOpenEditDialog(false);
    setDialogMessage('Expense edited successfully');
    setOpenSuccessDialog(true);
  };

  const handleCustomCategorySubmit = async () => {
    if (!customCategory.trim()) return;
    const response = await fetch('http://localhost:9000/budget-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: customCategory }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to save category. Please try again later.');
      setOpenErrorDialog(true);
      setOpenCustomCategoryDialog(false);
      return;
    }

    fetchCategories();
    setCustomCategory('');
    setOpenCustomCategoryDialog(false);
    setDialogMessage('Category saved successfully');
    setOpenSuccessDialog(true);
  };

  return (
    <Box sx={{ py: { xs: 2, md: 10 }, px: 2, maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'black', mb: 4 }}>
        Expense Tracking and Recording
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', mb: 2 }}>
        Add Expense
      </Typography>

      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mx: 'auto' }}>
        <TextField
          id="expense-name"
          label="Expense Name"
          variant="outlined"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          error={!!errors.expenseName}
          helperText={errors.expenseName}
          required
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': { borderColor: '#C0C0C0' } }, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />
        <TextField
          id="expense-amount"
          label="Expense Amount (Rs.)"
          variant="outlined"
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          error={!!errors.expenseAmount}
          helperText={errors.expenseAmount}
          required
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': { borderColor: '#C0C0C0' } }, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />
        <TextField
          id="expense-category"
          select
          label="Expense Category"
          variant="outlined"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          error={!!errors.expenseCategory}
          helperText={errors.expenseCategory}
          required
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': { borderColor: '#C0C0C0' } }, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
          <MenuItem value="custom" onClick={() => setOpenCustomCategoryDialog(true)}>
            Add Custom Category
          </MenuItem>
        </TextField>
        <TextField
          id="expense-date"
          label="Expense Date"
          variant="outlined"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          error={!!errors.expenseDate}
          helperText={errors.expenseDate}
          required
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': { borderColor: '#C0C0C0' } }, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
          InputLabelProps={{ shrink: true }}
        />
        <Button sx={{ fontWeight: 'bold', fontSize: { xs: 16, md: 20 }, color: 'white', backgroundColor: '#343434' }} type="submit" variant="contained" fullWidth>
          Add Expense
        </Button>
      </Box>

      <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
        Expense List
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {expenses.map((expense) => (
          <Grid item xs={12} sm={6} md={4} key={expense.id}>
            <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
              <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>{expense.name}</Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>Amount: Rs. {expense.amount}</Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>Category: {expense.category}</Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>Date: {expense.date}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setExpenseToEdit(expense);
                    setExpenseName(expense.name);
                    setExpenseAmount(expense.amount.toString());
                    setExpenseCategory(expense.category);
                    setExpenseDate(expense.date);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setExpenseToDelete(expense.id);
                    setOpenDeleteDialog(true);
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Dialogs */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this expense?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="expense-name"
            label="Expense Name"
            type="text"
            fullWidth
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="expense-amount"
            label="Expense Amount (Rs.)"
            type="number"
            fullWidth
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            id="expense-category"
            label="Expense Category"
            fullWidth
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
            ))}
            <MenuItem value="custom" onClick={() => setOpenCustomCategoryDialog(true)}>Add Custom Category</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            id="expense-date"
            label="Expense Date"
            type="date"
            fullWidth
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent><DialogContentText>{dialogMessage}</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setOpenSuccessDialog(false)} autoFocus>OK</Button></DialogActions>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent><DialogContentText>{dialogMessage}</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setOpenErrorDialog(false)} autoFocus>OK</Button></DialogActions>
      </Dialog>

      <Dialog open={openCustomCategoryDialog} onClose={() => setOpenCustomCategoryDialog(false)}>
        <DialogTitle>Add Custom Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="custom-category"
            label="Category Name"
            type="text"
            fullWidth
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCustomCategoryDialog(false)}>Cancel</Button>
          <Button onClick={handleCustomCategorySubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExpenseManagement;