package com.arthManager.finance.dto;

import com.arthManager.finance.model.Finance;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FinanceDto {
    private Long id;
    private String description;
    private String category;
    private String transactionType; // e.g., "income", "expense", "borrow", "loan"
//    private String type; // e.g., "income", "expense", "borrow", "loan"
    private String paymentMethod; // e.g., "Cash", "Credit Card"
    private String counterparty; // e.g., "John Doe", "Company XYZ"
//    private LocalDate date; // Format: "YYYY-MM-DD"
    private LocalDate transactionDate; // Date of the transaction
    private BigDecimal amount; // Monetary value as a string to handle currency formatting
    private Finance.DueStatus dueStatus; // Enum for loan/borrow status e.g ("PAID", "UNPAID", "PARTIALLY_PAID")
    private LocalDate dueDate;
    private String clientDescription;
    private Boolean emailReminder;

}
