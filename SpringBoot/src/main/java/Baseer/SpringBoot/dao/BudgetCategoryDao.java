package Baseer.SpringBoot.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import Baseer.SpringBoot.entity.BudgetCategory;

public interface BudgetCategoryDao extends JpaRepository<BudgetCategory, Integer> {

}
