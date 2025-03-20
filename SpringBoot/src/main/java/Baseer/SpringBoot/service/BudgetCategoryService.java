package Baseer.SpringBoot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Baseer.SpringBoot.entity.BudgetCategory;
import Baseer.SpringBoot.dao.BudgetCategoryDao;

@Service
public class BudgetCategoryService {

    @Autowired
    private BudgetCategoryDao budgetCategoryDao;

    public List<BudgetCategory> findAll() {
        return budgetCategoryDao.findAll();
    }

    public BudgetCategory save(BudgetCategory budgetCategory) {
        return budgetCategoryDao.save(budgetCategory);
    }

    public BudgetCategory findOne(int id) {
        return budgetCategoryDao.findById(id).orElse(null);
    }

    public void deleteById(int id) {
        budgetCategoryDao.deleteById(id);
    }
}
