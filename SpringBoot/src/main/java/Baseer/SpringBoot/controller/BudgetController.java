package Baseer.SpringBoot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import Baseer.SpringBoot.entity.Budget;
import Baseer.SpringBoot.service.BudgetService;

@CrossOrigin
@RestController
public class BudgetController {

    @Autowired
    private BudgetService service;

    @GetMapping("/budgets")
    public List<Budget> retrieveAllBudgets() {
        return service.findAll();
    }

    @GetMapping("/budgets/{id}")
    public Budget retrieveBudget(@PathVariable int id) {
        return service.findOne(id);
    }

    @PostMapping("/budgets")
    public Budget createBudget(@RequestBody Budget budget) {
        return service.save(budget);
    }

    @DeleteMapping("/budgets/{id}")
    public void deleteBudget(@PathVariable int id) {
        service.deleteById(id);
    }

    @PutMapping("/budgets/{id}")
    public Budget updateBudget(@RequestBody Budget budget, @PathVariable int id) {
        return service.updateBudget(budget, id);
    }
}
