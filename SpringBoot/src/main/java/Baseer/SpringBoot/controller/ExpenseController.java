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

import Baseer.SpringBoot.entity.Expense;
import Baseer.SpringBoot.service.ExpenseService;

@CrossOrigin
@RestController
public class ExpenseController {

    @Autowired
    private ExpenseService service;

    @GetMapping("/expenses")
    public List<Expense> retrieveAllExpenses() {
        return service.findAll();
    }

    @GetMapping("/expenses/{id}")
    public Expense retrieveExpense(@PathVariable int id) {
        return service.findOne(id);
    }

    @PostMapping("/expenses")
    public Expense createExpense(@RequestBody Expense expense) {
        return service.save(expense);
    }

    @DeleteMapping("/expenses/{id}")
    public void deleteExpense(@PathVariable int id) {
        service.deleteById(id);
    }

    @PutMapping("/expenses/{id}")
    public Expense updateExpense(@RequestBody Expense expense, @PathVariable int id) {
        return service.updateExpense(expense, id);
    }
}
