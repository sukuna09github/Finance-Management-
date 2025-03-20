package Baseer.SpringBoot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Baseer.SpringBoot.entity.Expense;
import Baseer.SpringBoot.dao.ExpenseDao;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseDao expenseDao;

    public List<Expense> findAll() {
        return expenseDao.findAll();
    }

    public Expense save(Expense expense) {
        return expenseDao.save(expense);
    }

    public Expense findOne(int id) {
        return expenseDao.findById(id).orElse(null);
    }

    public void deleteById(int id) {
        expenseDao.deleteById(id);
    }

    public Expense updateExpense(Expense updatedExpense, int id) {
        Expense existingExpense = findOne(id);
        if (existingExpense == null) {
            throw new RuntimeException("Expense not found with id: " + id);
        }
        updatedExpense.setId(id); // Ensure the ID in the request body matches the path variable
        return expenseDao.save(updatedExpense);
    }
}
