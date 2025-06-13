package com.arthManager.finance.service;

import com.arthManager.finance.dto.AddFinance;
import com.arthManager.finance.dto.FinanceDto;
import com.arthManager.finance.model.Finance;
import com.arthManager.user.model.User;
import com.arthManager.finance.repository.FinanceRepository;
import com.arthManager.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final FinanceRepository financeRepository;
    private final UserRepository userRepository;

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public Page<FinanceDto> getTransactions(String username, String type, String category, String startDate,
            String endDate, Pageable pageable) {
        User user = getUserByUsername(username);
        Finance.TransactionType transactionType = null;
        if (type != null && !type.isEmpty()) {
            try {
                transactionType = Finance.TransactionType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid transaction type: " + type);
            }
        }
        LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
        LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate) : null;
        Page<Finance> page = financeRepository.findByUserAndFilters(
                user, transactionType, category, start, end, pageable);
        return page.map(this::toDto);
    }

    public FinanceDto getTransactionById(String username, Long id) {
        User user = getUserByUsername(username);
        Finance finance = financeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transaction not found or not authorized"));
        return toDto(finance);
    }

    @Transactional
    public Finance createFinanceRecord(AddFinance addFinance, String username) {
        User user = getUserByUsername(username);
        Finance finance = new Finance();
        finance.setTransactionDate(addFinance.getTransactionDate());
        finance.setDescription(addFinance.getDescription());
        finance.setAmount(addFinance.getAmount());
        finance.setCategory(addFinance.getCategory());
        finance.setTransactionType(addFinance.getTransactionType());
        finance.setPaymentMethod(addFinance.getPaymentMethod());
        finance.setCounterparty(addFinance.getCounterparty() == null || addFinance.getCounterparty().isEmpty() ? "Self"
                : addFinance.getCounterparty());

        // Set dueStatus for LOAN/BORROW
        if (addFinance.getDueStatus() == null) {
            if (addFinance.getTransactionType() == Finance.TransactionType.LOAN ||
                    addFinance.getTransactionType() == Finance.TransactionType.BORROW) {
                finance.setDueStatus(Finance.DueStatus.UNPAID);
            }
        } else {
            finance.setDueStatus(addFinance.getDueStatus());
        }

        // When creating Finance from AddFinance:
        finance.setDueDate(addFinance.getDueDate());
        finance.setClientDescription(addFinance.getClientDescription());
        finance.setEmailReminder(addFinance.getEmailReminder());

        finance.setUser(user);

        // Update user balance
        BigDecimal currentBalance = user.getBalance() != null ? user.getBalance() : BigDecimal.ZERO;
        if (addFinance.getTransactionType() == Finance.TransactionType.EXPENSE ||
                addFinance.getTransactionType() == Finance.TransactionType.LOAN ||
                addFinance.getTransactionType() == Finance.TransactionType.BORROW) {
            currentBalance = currentBalance.subtract(addFinance.getAmount());
        } else if (addFinance.getTransactionType() == Finance.TransactionType.INCOME) {
            currentBalance = currentBalance.add(addFinance.getAmount());
        }
        user.setBalance(currentBalance);
        finance.setBalance(currentBalance);

        // Validate due status for LOAN/BORROW
        if ((addFinance.getTransactionType() == Finance.TransactionType.LOAN ||
                addFinance.getTransactionType() == Finance.TransactionType.BORROW) &&
                addFinance.getDueStatus() == null) {
            throw new IllegalArgumentException("Due status is required for Loan or Borrow transactions.");
        }

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
        // When mapping to DTO:
        dto.setDueDate(finance.getDueDate());
        dto.setClientDescription(finance.getClientDescription());
        dto.setEmailReminder(finance.getEmailReminder());
        return dto;
    }
}
