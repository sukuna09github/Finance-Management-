package Baseer.SpringBoot.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import Baseer.SpringBoot.entity.Expense;

public interface ExpenseDao extends JpaRepository<Expense, Integer> {

}
