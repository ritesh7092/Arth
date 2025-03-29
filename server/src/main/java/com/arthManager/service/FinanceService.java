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
import org.springframework.transaction.annotation.Transactional;

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

    // Get authenticated user from security context
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username);
    }

    // Save a new finance transaction
    @Transactional
    public Finance saveFinance(Finance finance) {
        User user = getAuthenticatedUser();

        // Ensure user balance is not null (initialize it in User entity ideally)
        BigDecimal currentBalance = (user.getBalance() != null) ? user.getBalance() : BigDecimal.ZERO;
        BigDecimal adjusted = currentBalance.add(finance.getAmount());
        user.setBalance(adjusted);

        finance.setUser(user);
        // Set the finance record's balance field (if intended to represent user's balance after transaction)
        finance.setBalance(adjusted);

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
    @Transactional
    public boolean updateFinance(Finance finance) {
        User user = getAuthenticatedUser();

        Optional<Finance> financeInDbOpt = financeRepository.findById(finance.getId());
        if (!financeInDbOpt.isPresent()) {
            return false;
        }

        Finance existingFinance = financeInDbOpt.get();
        // Compare by id for clarity (assuming neither is null)
        if (existingFinance.getUser() == null ||
                !existingFinance.getUser().getId().equals(user.getId())) {
            return false;
        }

        // Adjust user's balance: subtract old transaction and add new one
        BigDecimal currentBalance = (user.getBalance() != null) ? user.getBalance() : BigDecimal.ZERO;
        BigDecimal adjusted = currentBalance.subtract(existingFinance.getAmount()).add(finance.getAmount());
        user.setBalance(adjusted);

        // Update finance fields
        existingFinance.setTransactionDate(finance.getTransactionDate());
        existingFinance.setDescription(finance.getDescription());
        existingFinance.setAmount(finance.getAmount());
        existingFinance.setCategory(finance.getCategory());
        existingFinance.setTransactionType(finance.getTransactionType());
        existingFinance.setPaymentMethod(finance.getPaymentMethod());
        existingFinance.setCounterparty(finance.getCounterparty());
        existingFinance.setLoanStatus(finance.getLoanStatus());

        // Set finance record balance to reflect updated user balance if needed
        existingFinance.setBalance(adjusted);

        financeRepository.save(existingFinance);
        return true;
    }

    // Delete a finance record
    @Transactional
    public boolean deleteFinance(Long financeId) {
        User user = getAuthenticatedUser();

        Optional<Finance> financeOpt = financeRepository.findById(financeId);
        if (!financeOpt.isPresent()) {
            return false;
        }

        Finance finance = financeOpt.get();
        if (finance.getUser() == null || !finance.getUser().getId().equals(user.getId())) {
            return false;
        }

        // Subtract the finance amount from the user's balance
        BigDecimal currentBalance = (user.getBalance() != null) ? user.getBalance() : BigDecimal.ZERO;
        BigDecimal adjustedAmount = currentBalance.subtract(finance.getAmount());
        user.setBalance(adjustedAmount);

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

        return transactions.stream()
                .map(Finance::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Get yearly financial summary
    public BigDecimal getYearlySummary(int year) {
        User user = getAuthenticatedUser();

        List<Finance> transactions = financeRepository.findByUser(user).stream()
                .filter(finance -> finance.getTransactionDate().getYear() == year)
                .collect(Collectors.toList());

        return transactions.stream()
                .map(Finance::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Get total income vs expenses summary
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
    @Transactional
    public boolean markLoanAsCompleted(Long financeId) {
        User user = getAuthenticatedUser();

        Optional<Finance> financeOpt = financeRepository.findById(financeId);
        if (!financeOpt.isPresent()) {
            return false;
        }

        Finance finance = financeOpt.get();
        if (finance.getUser() == null || !finance.getUser().getId().equals(user.getId())) {
            return false;
        }

        finance.setLoanStatus(LoanStatus.COMPLETED);
        financeRepository.save(finance);
        return true;
    }

    // Find finance by id ensuring it belongs to the authenticated user
    public Finance findFinanceById(Long financeId) {
        User user = getAuthenticatedUser();
        Optional<Finance> financeOpt = financeRepository.findById(financeId);
        if (financeOpt.isEmpty()) {
            return null;
        }
        Finance finance = financeOpt.get();
        if (finance.getUser() == null || !finance.getUser().getId().equals(user.getId())) {
            return null;
        }
        return finance;
    }

    public BigDecimal getUserBalance() {
        User user = getAuthenticatedUser();
        return user.getBalance();
    }
}

