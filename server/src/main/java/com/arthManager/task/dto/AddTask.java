package com.arthManager.task.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AddTask {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 5, max = 500, message = "Description must be between 5 and 500 characters")
    private String description;

    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "^(high|medium|low)$", message = "Priority must be 'high', 'medium', or 'low'")
    private String priority;

    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date must be in the present or future")
    private LocalDate dueDate;

    @NotBlank(message = "Type is required")
//    @Pattern(regexp = "^(official|family|personal)$", message = "Type must be 'official', 'family', or 'personal'")
    private String type;

    // Optional field - no validation needed as it can be null
    private Boolean emailReminder;
}
