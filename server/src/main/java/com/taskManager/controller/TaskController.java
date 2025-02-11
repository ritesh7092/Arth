package com.taskManager.controller;

import com.taskManager.exception.UserNotFoundException;
import com.taskManager.model.Task;
import com.taskManager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<Task> addTask(@Valid @RequestBody Task task, @PathVariable Long userId) {
        try {
            Task createdTask = taskService.addTask(task, userId);
            return ResponseEntity.status(201).body(createdTask); // 201 Created
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(null); // User not found
        }
    }

    @GetMapping("/upcoming/{userId}")
    public ResponseEntity<List<Task>> getUpcomingTasks(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(taskService.getUpcomingTasks(userId));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/category/{userId}/{category}")
    public ResponseEntity<List<Task>> getTasksByCategory(@PathVariable Long userId, @PathVariable String category) {
        try {
            return ResponseEntity.ok(taskService.getTasksByCategory(userId, category));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }
}

