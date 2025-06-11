package com.arthManager.finance.service;

import com.arthManager.finance.dto.AddFinance;
import com.arthManager.finance.dto.FinanceDto;
import com.arthManager.finance.model.Finance;
import com.arthManager.user.model.User;
import com.arthManager.finance.repository.FinanceRepository;
import com.arthManager.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
        return userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );
    }


    public Page<FinanceDto> getTransactions(String username, String type, String category, String startDate, String endDate, Pageable pageable){
        User user = getAuthenticatedUser();
        LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
        LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate): null;
        Page<Finance> page = financeRepository.findByUserAndFilters(
                user, type, category, start, end, pageable
        );
        return page.map(this::toDto);
    }

    public FinanceDto getTransactionById(String username, Long id){
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );
        Finance finance = financeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return toDto(finance);
    }

    public Finance createFinanceRecord(AddFinance addFinance) {
        User user = getAuthenticatedUser();
        Finance finance = new Finance();
        finance.setTransactionDate(addFinance.getTransactionDate());
        finance.setDescription(addFinance.getDescription());
        finance.setAmount(addFinance.getAmount());
        finance.setCategory(addFinance.getCategory());
        finance.setTransactionType(addFinance.getTransactionType());
        finance.setPaymentMethod(addFinance.getPaymentMethod());
        if(addFinance.getCounterparty() == null || addFinance.getCounterparty().isEmpty()) {
            finance.setCounterparty("Self"); // Default value if counterparty is not provided
        } else {
            finance.setCounterparty(addFinance.getCounterparty());
        }
//        finance.setCounterparty(addFinance.getCounterparty());
        if (addFinance.getDueStatus() == null) {
            if (addFinance.getTransactionType() == Finance.TransactionType.LOAN ||
                    addFinance.getTransactionType() == Finance.TransactionType.BORROW) {
                finance.setDueStatus(Finance.DueStatus.UNPAID); // Default for LOAN or BORROW
            } else {
                finance.setDueStatus(null); // Keep as null for others
            }
        } else {
            finance.setDueStatus(addFinance.getDueStatus()); // Use provided value
        }

        finance.setUser(user);
        finance.setCreatedAt(LocalDateTime.now());
        finance.setUpdatedAt(LocalDateTime.now());
        // Ensure user balance is not null (initialize it in User entity ideally)
        BigDecimal currentBalance = (user.getBalance() != null) ? user.getBalance() : BigDecimal.ZERO;
        // Adjust user's balance based on the transaction type
        if (addFinance.getTransactionType() == Finance.TransactionType.EXPENSE ||
                addFinance.getTransactionType() == Finance.TransactionType.LOAN ||
                addFinance.getTransactionType() == Finance.TransactionType.BORROW) {
            currentBalance = currentBalance.subtract(addFinance.getAmount());
        } else if (addFinance.getTransactionType() == Finance.TransactionType.INCOME) {
            currentBalance = currentBalance.add(addFinance.getAmount());
        }
        user.setBalance(currentBalance);
        finance.setBalance(currentBalance); // Set the finance record's balance field
        return financeRepository.save(finance);
    }

    private FinanceDto toDto(Finance finance) {
        FinanceDto dto = new FinanceDto();
        dto.setId(finance.getId());
        dto.setDescription(finance.getDescription());
        dto.setCategory(finance.getCategory());
        dto.setType(finance.getTransactionType().name());
        dto.setPaymentMethod(finance.getPaymentMethod());
        dto.setCounterparty(finance.getCounterparty());
        dto.setDate(finance.getTransactionDate());
        dto.setAmount(finance.getAmount());
        dto.setDueStatus(finance.getDueStatus());
        return dto;
    }
}

