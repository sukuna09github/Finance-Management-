import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function BudgetManagement() {
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetCategory, setBudgetCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openCustomCategoryDialog, setOpenCustomCategoryDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:9000/budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
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
    fetchBudgets();
    fetchCategories();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!budgetName.trim()) errors.budgetName = 'Budget Name is required';
    if (!budgetAmount.trim()) errors.budgetAmount = 'Budget Amount is required';
    else if (isNaN(budgetAmount)) errors.budgetAmount = 'Budget Amount must be a number';
    if (!budgetCategory.trim()) errors.budgetCategory = 'Budget Category is required';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const response = await fetch('http://localhost:9000/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: budgetName, amount: parseFloat(budgetAmount), category: budgetCategory }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to save budget. Please try again later.');
      setOpenErrorDialog(true);
      return;
    }

    fetchBudgets();
    setBudgetName('');
    setBudgetAmount('');
    setBudgetCategory('');
    setErrors({});
    setDialogMessage('Budget saved successfully');
    setOpenSuccessDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    const response = await fetch(`http://localhost:9000/budgets/${budgetToDelete}`, { method: 'DELETE' });
    if (!response.ok) {
      setDialogMessage('Failed to delete budget. Please try again later.');
      setOpenErrorDialog(true);
      setOpenDeleteDialog(false);
      return;
    }
    fetchBudgets();
    setOpenDeleteDialog(false);
    setDialogMessage('Budget deleted successfully');
    setOpenSuccessDialog(true);
  };

  const handleConfirmEdit = async () => {
    if (!budgetToEdit) return;
    const response = await fetch(`http://localhost:9000/budgets/${budgetToEdit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: budgetName, amount: parseFloat(budgetAmount), category: budgetCategory }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to edit budget. Please try again later.');
      setOpenErrorDialog(true);
      setOpenEditDialog(false);
      return;
    }

    fetchBudgets();
    setBudgetName('');
    setBudgetAmount('');
    setBudgetCategory('');
    setErrors({});
    setOpenEditDialog(false);
    setDialogMessage('Budget edited successfully');
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

    await fetchCategories(); // Refresh categories
    setBudgetCategory(customCategory); // Set the new category as selected
    setCustomCategory('');
    setOpenCustomCategoryDialog(false);
    setDialogMessage('Category saved successfully');
    setOpenSuccessDialog(true);
  };

  return (
    <Box sx={{ py: { xs: 2, md: 10 }, px: 2, maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'black', mb: 4 }}>
        Budget Management
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', mb: 2 }}>
        Add Budget
      </Typography>

      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mx: 'auto' }}>
        <TextField
          id="budget-name"
          label="Budget Name"
          variant="outlined"
          value={budgetName}
          onChange={(e) => setBudgetName(e.target.value)}
          error={!!errors.budgetName}
          helperText={errors.budgetName}
          required
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': { borderColor: '#C0C0C0' } }, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />
        <TextField
          id="budget-amount"
          label="Budget Amount (Rs.)"
          variant="outlined"
          type="number"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          error={!!errors.budgetAmount}
          helperText={errors.budgetAmount}
          required
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': { borderColor: '#C0C0C0' } }, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />
        <TextField
          id="budget-category"
          select
          label="Budget Category"
          variant="outlined"
          value={budgetCategory}
          onChange={(e) => setBudgetCategory(e.target.value)}
          error={!!errors.budgetCategory}
          helperText={errors.budgetCategory}
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
        <Button sx={{ fontWeight: 'bold', fontSize: { xs: 16, md: 20 }, color: 'white', backgroundColor: '#343434' }} type="submit" variant="contained" fullWidth>
          Add Budget
        </Button>
      </Box>

      <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
        Budget List
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {budgets.map((budget) => (
          <Grid item xs={12} sm={6} md={4} key={budget.id}>
            <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
              <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>{budget.name}</Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>Amount: Rs. {budget.amount}</Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>Category: {budget.category}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setBudgetToEdit(budget);
                    setBudgetName(budget.name);
                    setBudgetAmount(budget.amount.toString());
                    setBudgetCategory(budget.category);
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
                    setBudgetToDelete(budget.id);
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
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this budget?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="edit-budget-name"
            label="Budget Name"
            type="text"
            fullWidth
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
          />
          <TextField
            margin="dense"
            id="edit-budget-amount"
            label="Budget Amount"
            type="number"
            fullWidth
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
          />
          <TextField
            margin="dense"
            id="edit-budget-category"
            select
            label="Budget Category"
            fullWidth
            value={budgetCategory}
            onChange={(e) => setBudgetCategory(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
            ))}
            <MenuItem value="custom" onClick={() => setOpenCustomCategoryDialog(true)}>Add Custom Category</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent><DialogContentText>{dialogMessage}</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setOpenSuccessDialog(false)}>OK</Button></DialogActions>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent><DialogContentText>{dialogMessage}</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setOpenErrorDialog(false)}>OK</Button></DialogActions>
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

export default BudgetManagement;