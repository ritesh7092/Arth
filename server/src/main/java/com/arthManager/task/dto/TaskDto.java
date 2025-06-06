package com.arthManager.task.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private String priority;      // "high", "medium", or "low"
    private LocalDate dateAdded;
    private LocalDate dueDate;
    private boolean completed;
}
