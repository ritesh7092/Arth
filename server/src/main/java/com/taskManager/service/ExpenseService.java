package com.taskManager.service;

import com.taskManager.exception.UserNotFoundException;
import com.taskManager.model.Expense;
import com.taskManager.model.User;
import com.taskManager.repository.ExpenseRepository;
import com.taskManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Expense addExpense(Expense expense, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found"));

        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByCategory(Long userId, String category) {
        validateUserExists(userId);
        return expenseRepository.findByUserIdAndCategory(userId, category);
    }

    public List<Expense> getExpensesBetweenDates(Long userId, LocalDate start, LocalDate end) {
        validateUserExists(userId);
        return expenseRepository.findByUserIdAndDateBetween(userId, start, end);
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User with ID " + userId + " not found");
        }
    }
}



