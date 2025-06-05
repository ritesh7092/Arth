package com.arthManager.finance.dto;

import com.arthManager.finance.model.Finance;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AddFinance {
    private String category; // e.g., "salary", "rent", "groceries", etc.
    private String description;
    private Finance.TransactionType transactionType; // can be "income" or "expense", "borrow", or "loan"
    private BigDecimal amount;
    private LocalDate transactionDate; // date in the format "YYYY-MM-DD"
    private String paymentMethod; // e.g., "cash", "credit card", "bank transfer"
    private String counterparty; // e.g., "John Doe", "XYZ Corp", etc.
    private Finance.DueStatus dueStatus; // e.g., "pending", "completed"

}

