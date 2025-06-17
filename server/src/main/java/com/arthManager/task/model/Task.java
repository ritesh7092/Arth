package com.arthManager.task.model;

import com.arthManager.user.model.User;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    // can be "high", "medium", or "low"
    private String priority;

    // Due date for the task

    @DateTimeFormat(pattern = "yyyy-MM-dd") // Ensuring consistent date format
    private LocalDate dueDate;

    // Task type can be "official", "family", or "personal"
    private String type;

    // Date when the task was added
    private LocalDate dateAdded;

    // Flag to indicate if the task is completed
    private boolean completed;

    // Date when the task was marked as completed
    private LocalDate completionDate;

    // Optional field for email reminders
    private boolean emailReminder;

    // Many-to-one relationship with User (each task belongs to a user)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Constructors, getters, and setters

    public Task() {
        // Automatically set the creation date when a task is created
        this.dateAdded = LocalDate.now();
        this.completed = false; // By default, a new task is not completed
    }


    public void setCompleted(boolean completed) {
        this.completed = completed;
        // Set the completionDate when marking the task as completed
        if (completed && this.completionDate == null) {
            this.completionDate = LocalDate.now();
        } else if (!completed) {
            this.completionDate = null;
        }
    }

    // Utility method to handle truncation of description to display in dashboard
    public String getShortDescription() {
        return description != null && description.length() > 10
                ? description.substring(0, 10) + "..."
                : description;
    }
}
