package Baseer.SpringBoot.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import Baseer.SpringBoot.entity.Budget;

public interface BudgetDao extends JpaRepository<Budget, Integer> {

}
