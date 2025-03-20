package Baseer.SpringBoot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Baseer.SpringBoot.entity.Budget;
import Baseer.SpringBoot.dao.BudgetDao;

@Service
public class BudgetService {

    @Autowired
    private BudgetDao budgetDao;

    public List<Budget> findAll() {
        return budgetDao.findAll();
    }

    public Budget save(Budget budget) {
        return budgetDao.save(budget);
    }

    public Budget findOne(int id) {
        return budgetDao.findById(id).orElse(null);
    }

    public void deleteById(int id) {
        budgetDao.deleteById(id);
    }

    public Budget updateBudget(Budget updatedBudget, int id) {
        Budget existingBudget = findOne(id);
        if (existingBudget == null) {
            throw new RuntimeException("Budget not found with id: " + id);
        }
        updatedBudget.setId(id); // Ensure the ID in the request body matches the path variable
        return budgetDao.save(updatedBudget);
    }
}
