package com.arthManager.chatbot.service;

import org.springframework.stereotype.Component;

@Component
public class SchemaProvider {

    private String getFinanceSchema() {
        return """
            TABLE: finance
            COLUMNS:
            - id (BIGINT, PRIMARY KEY): Unique identifier for each finance record
            - user_id (BIGINT, NOT NULL): Foreign key referencing users table
            - transaction_date (DATE, NOT NULL): Date when the transaction occurred
            - description (VARCHAR, NOT NULL): Description of the transaction
            - amount (DECIMAL, NOT NULL): Transaction amount
            - category (VARCHAR, NOT NULL): Transaction category (Food, Transportation, Entertainment, Utilities, etc.)
            - transaction_type (VARCHAR, NOT NULL): Type of transaction (INCOME, EXPENSE, LOAN, BORROW)
            - payment_method (VARCHAR): Method of payment (Cash, Credit Card, Bank Transfer, etc.)
            - counterparty (VARCHAR): Name of person/entity involved in transaction
            - created_at (TIMESTAMP): When the record was created
            - updated_at (TIMESTAMP): When the record was last updated
            - balance (DECIMAL): Remaining balance for loan/borrow transactions
            - due_status (VARCHAR): Status for loan/borrow (PAID, UNPAID, PARTIALLY_PAID)
            - due_date (DATE): Due date for loan/borrow settlement
            - client_description (VARCHAR): Additional description for loan/borrow
            - email_reminder (BOOLEAN): Whether email reminder is enabled
            
            TABLE: users
            COLUMNS:
            - id (BIGINT, PRIMARY KEY): User unique identifier
            - username (VARCHAR): Username
            - email (VARCHAR): User email
            - first_name (VARCHAR): User first name
            - last_name (VARCHAR): User last name
            
            NOTES:
            - Always filter by user_id to ensure data isolation
            - transaction_type values: 'INCOME', 'EXPENSE', 'LOAN', 'BORROW'
            - due_status values: 'PAID', 'UNPAID', 'PARTIALLY_PAID'
            - Common categories: 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Education'
            """;
    }

    private String getTaskSchema() {
        return """
            TABLE: task
            COLUMNS:
            - id (BIGINT, PRIMARY KEY): Unique identifier for each task
            - user_id (BIGINT, NOT NULL): Foreign key referencing users table
            - title (VARCHAR, NOT NULL): Task title
            - description (VARCHAR): Task description
            - priority (VARCHAR): Task priority level (high, medium, low)
            - due_date (DATE): Task due date
            - type (VARCHAR): Task type (official, family, personal)
            - date_added (DATE): Date when task was created
            - completed (BOOLEAN): Whether task is completed
            - completion_date (DATE): Date when task was marked as completed
            - email_reminder (BOOLEAN): Whether email reminder is enabled
            
            TABLE: users
            COLUMNS:
            - id (BIGINT, PRIMARY KEY): User unique identifier
            - username (VARCHAR): Username
            - email (VARCHAR): User email
            - first_name (VARCHAR): User first name
            - last_name (VARCHAR): User last name
            
            NOTES:
            - Always filter by user_id to ensure data isolation
            - priority values: 'high', 'medium', 'low'
            - type values: 'official', 'family', 'personal'
            - completed is boolean (true/false)
            - Use date_added for when task was created, completion_date for when completed
            """;
    }

    private String getCombinedSchema() {
        return """
            TABLE: finance
            COLUMNS:
            - id (BIGINT, PRIMARY KEY): Unique identifier for each finance record
            - user_id (BIGINT, NOT NULL): Foreign key referencing users table
            - transaction_date (DATE, NOT NULL): Date when the transaction occurred
            - description (VARCHAR, NOT NULL): Description of the transaction
            - amount (DECIMAL, NOT NULL): Transaction amount
            - category (VARCHAR, NOT NULL): Transaction category
            - transaction_type (VARCHAR, NOT NULL): Type (INCOME, EXPENSE, LOAN, BORROW)
            - payment_method (VARCHAR): Payment method
            - counterparty (VARCHAR): Person/entity involved
            - created_at (TIMESTAMP): Record creation time
            - balance (DECIMAL): Remaining balance for loans/borrows
            - due_status (VARCHAR): Status (PAID, UNPAID, PARTIALLY_PAID)
            - due_date (DATE): Due date for settlement
            
            TABLE: task
            COLUMNS:
            - id (BIGINT, PRIMARY KEY): Unique identifier for each task
            - user_id (BIGINT, NOT NULL): Foreign key referencing users table
            - title (VARCHAR, NOT NULL): Task title
            - description (VARCHAR): Task description
            - priority (VARCHAR): Priority level (high, medium, low)
            - due_date (DATE): Task due date
            - type (VARCHAR): Task type (official, family, personal)
            - date_added (DATE): Creation date
            - completed (BOOLEAN): Completion status
            - completion_date (DATE): Completion date
            
            TABLE: users
            COLUMNS:
            - id (BIGINT, PRIMARY KEY): User unique identifier
            - username (VARCHAR): Username
            - email (VARCHAR): User email
            - first_name (VARCHAR): User first name
            - last_name (VARCHAR): User last name
            
            NOTES:
            - Always filter by user_id for data isolation
            - Finance transaction_type: 'INCOME', 'EXPENSE', 'LOAN', 'BORROW'
            - Task priority: 'high', 'medium', 'low'
            - Task type: 'official', 'family', 'personal'
            """;
    }
}
