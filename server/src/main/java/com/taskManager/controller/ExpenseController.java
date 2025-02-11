package com.taskManager.controller;

import com.taskManager.exception.UserNotFoundException;
import com.taskManager.model.Expense;
import com.taskManager.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<Expense> addExpense(@Valid @RequestBody Expense expense, @PathVariable Long userId) {
        try {
            Expense createdExpense = expenseService.addExpense(expense, userId);
            return ResponseEntity.status(201).body(createdExpense); // 201 Created
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/category/{userId}/{category}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(@PathVariable Long userId, @PathVariable String category) {
        try {
            return ResponseEntity.ok(expenseService.getExpensesByCategory(userId, category));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/date/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByDate(@PathVariable Long userId, @RequestParam LocalDate start, @RequestParam LocalDate end) {
        try {
            return ResponseEntity.ok(expenseService.getExpensesBetweenDates(userId, start, end));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }
}
