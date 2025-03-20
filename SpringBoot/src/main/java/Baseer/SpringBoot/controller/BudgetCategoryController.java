package Baseer.SpringBoot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import Baseer.SpringBoot.entity.BudgetCategory;
import Baseer.SpringBoot.service.BudgetCategoryService;

@CrossOrigin
@RestController
public class BudgetCategoryController {

    @Autowired
    private BudgetCategoryService service;

    @GetMapping("/budget-categories")
    public List<BudgetCategory> retrieveAllBudgetCategories() {
        return service.findAll();
    }

    @GetMapping("/budget-categories/{id}")
    public BudgetCategory retrieveBudgetCategory(@PathVariable int id) {
        return service.findOne(id);
    }

    @PostMapping("/budget-categories")
    public BudgetCategory createBudgetCategory(@RequestBody BudgetCategory budgetCategory) {
        return service.save(budgetCategory);
    }

    @DeleteMapping("/budget-categories/{id}")
    public void deleteBudgetCategory(@PathVariable int id) {
        service.deleteById(id);
    }
}
