package com.arthManager.finance.dto;

import com.arthManager.finance.model.Finance;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AddFinance {
    @NotNull(message = "Transaction date is required")
    @PastOrPresent(message = "Transaction date must be in the past or present")
    private LocalDate transactionDate;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Transaction type is required")
    private Finance.TransactionType transactionType;

    private String paymentMethod;
    private String counterparty;
    private Finance.DueStatus dueStatus;
    private LocalDate dueDate;
    private String clientDescription;
    private Boolean emailReminder;
}