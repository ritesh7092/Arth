package com.arthManager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


//import javax.persistence.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "finance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Finance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Date when the transaction occurred
    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    // A brief description of the transaction
    @Column(name = "description", nullable = false)
    private String description;

    // The monetary amount of the transaction; using BigDecimal for precision
    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    // Category (e.g., Food, Transportation, Utilities) for organizing transactions
    @Column(name = "category", nullable = false)
    private String category;

    // Transaction type to distinguish income, expense, borrow, or loan transactions
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    // Optional field to capture how the payment was made (e.g., Cash, Credit Card)
    @Column(name = "payment_method")
    private String paymentMethod;

    // Optional field for counterparty: the name of the person or entity involved
    @Column(name = "counterparty")
    private String counterparty;

    // Audit fields for tracking record creation and updates
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Optional balance field to track remaining amount for a loan/borrow transaction
    @Column(name = "balance")
    private BigDecimal balance = BigDecimal.ZERO;

    // Relationship: Each Finance record belongs to one User.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Optional field for loan/borrow transactions: tracks if the transaction is still pending or completed.
    @Enumerated(EnumType.STRING)
    @Column(name = "loan_status")
    private LoanStatus loanStatus;


    // Automatically set timestamps when creating/updating a record
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Enum for transaction type: includes options for borrow and loan.
    public enum TransactionType {
        INCOME,
        EXPENSE,
        BORROW,  // Money borrowed by the user from someone else
        LOAN     // Money lent by the user to someone else
    }

    // Enum for loan/borrow status.
    public enum LoanStatus {
        PENDING,
        COMPLETED
    }
}

