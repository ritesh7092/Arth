package com.arthManager.service;

import com.arthManager.model.Finance;
import com.arthManager.model.User;
import com.arthManager.model.Finance.LoanStatus;
import com.arthManager.model.Finance.TransactionType;
import com.arthManager.repository.FinanceRepository;
import com.arthManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FinanceService {

    @Autowired
    private final FinanceRepository financeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public FinanceService(FinanceRepository financeRepository) {
        this.financeRepository = financeRepository;
    }

    // Get authenticated user
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username);
    }

    // Save a new finance transaction
    public Finance saveFinance(Finance finance) {
        User user = getAuthenticatedUser();
        finance.setUser(user);
        return financeRepository.save(finance);
    }

    // Get all transactions for the authenticated user
    public List<Finance> getAllFinancesForUser() {
        User user = getAuthenticatedUser();
        return financeRepository.findByUser(user);
    }

    // Get transactions for a specific date
    public List<Finance> getFinancesForDate(LocalDate date) {
        User user = getAuthenticatedUser();
        return financeRepository.findByUserAndTransactionDate(user, date);
    }

    // Get transactions for a specific category
    public List<Finance> getFinancesByCategory(String category) {
        User user = getAuthenticatedUser();
        return financeRepository.findByUserAndCategory(user, category);
    }

    // Get transactions filtered by type (INCOME, EXPENSE, LOAN, BORROW)
    public List<Finance> getTransactionsByType(TransactionType type) {
        User user = getAuthenticatedUser();
        return financeRepository.findByUserAndTransactionType(user, type);
    }

    // Get loan/borrow transactions by status (PENDING, COMPLETED)
    public List<Finance> getLoansByStatus(LoanStatus status) {
        User user = getAuthenticatedUser();
        return financeRepository.findByUserAndLoanStatus(user, status);
    }

    // Update a finance record
    public boolean updateFinance(Finance finance) {
        User user = getAuthenticatedUser();

        Optional<Finance> financeInDbOpt = financeRepository.findById(finance.getId());
        if (!financeInDbOpt.isPresent()) return false;

        Finance existingFinance = financeInDbOpt.get();
        if (!existingFinance.getUser().equals(user)) return false;

        // Update fields
        existingFinance.setTransactionDate(finance.getTransactionDate());
        existingFinance.setDescription(finance.getDescription());
        existingFinance.setAmount(finance.getAmount());
        existingFinance.setCategory(finance.getCategory());
        existingFinance.setTransactionType(finance.getTransactionType());
        existingFinance.setPaymentMethod(finance.getPaymentMethod());
        existingFinance.setCounterparty(finance.getCounterparty());
        existingFinance.setBalance(finance.getBalance());
        existingFinance.setLoanStatus(finance.getLoanStatus());

        financeRepository.save(existingFinance);
        return true;
    }

    // Delete a finance record
    public boolean deleteFinance(Long financeId) {
        User user = getAuthenticatedUser();

        Optional<Finance> financeOpt = financeRepository.findById(financeId);
        if (!financeOpt.isPresent()) return false;

        Finance finance = financeOpt.get();
        if (!finance.getUser().equals(user)) return false;

        financeRepository.delete(finance);
        return true;
    }

    // Get monthly financial summary
    public BigDecimal getMonthlySummary(int year, int month) {
        User user = getAuthenticatedUser();
        YearMonth yearMonth = YearMonth.of(year, month);

        List<Finance> transactions = financeRepository.findByUser(user).stream()
                .filter(finance -> YearMonth.from(finance.getTransactionDate()).equals(yearMonth))
                .collect(Collectors.toList());

        return transactions.stream().map(Finance::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Get yearly financial summary
    public BigDecimal getYearlySummary(int year) {
        User user = getAuthenticatedUser();

        List<Finance> transactions = financeRepository.findByUser(user).stream()
                .filter(finance -> finance.getTransactionDate().getYear() == year)
                .collect(Collectors.toList());

        return transactions.stream().map(Finance::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Get total income vs expenses
    public BigDecimal[] getIncomeVsExpenseSummary() {
        User user = getAuthenticatedUser();
        List<Finance> transactions = financeRepository.findByUser(user);

        BigDecimal totalIncome = transactions.stream()
                .filter(finance -> finance.getTransactionType() == TransactionType.INCOME)
                .map(Finance::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(finance -> finance.getTransactionType() == TransactionType.EXPENSE)
                .map(Finance::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new BigDecimal[]{totalIncome, totalExpense};
    }

    // Get list of pending loans/borrows
    public List<Finance> getPendingLoansOrBorrows() {
        User user = getAuthenticatedUser();
        return financeRepository.findByUserAndLoanStatus(user, LoanStatus.PENDING);
    }

    // Mark a loan or borrow transaction as completed
    public boolean markLoanAsCompleted(Long financeId) {
        User user = getAuthenticatedUser();

        Optional<Finance> financeOpt = financeRepository.findById(financeId);
        if (!financeOpt.isPresent()) return false;

        Finance finance = financeOpt.get();
        if (!finance.getUser().equals(user)) return false;

        finance.setLoanStatus(LoanStatus.COMPLETED);
        financeRepository.save(finance);
        return true;
    }

    public Finance findFinanceById(Long financeId) {
        User user = getAuthenticatedUser();
        Optional<Finance> financeOpt = financeRepository.findById(financeId);
        if (financeOpt.isEmpty()) {
            return null;
        }
        Finance finance = financeOpt.get();
        // Ensure the finance record belongs to the authenticated user
        if (!finance.getUser().equals(user)) {
            return null;
        }
        return finance;
    }
}

