package com.arthManager.task.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AddTask {
    @NotBlank(message = "Title is required")
    String title;
    @NotBlank(message = "Description is required")
    String description;
    @NotBlank(message = "Priority is required")
    String priority; // can be "high", "medium", or "low"
    LocalDate dueDate;
    String type; // Task type can be "official", "family", or "personal"
    Boolean emailReminder; // Optional field for email reminders
}
