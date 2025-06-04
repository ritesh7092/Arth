package com.arthManager.task.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AddTask {
    String title;
    String description;
    String priority; // can be "high", "medium", or "low"
    LocalDate dueDate;
    String type; // Task type can be "official", "family", or "personal"
}
