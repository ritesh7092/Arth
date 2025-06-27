package com.arthManager.task.controller;

import com.arthManager.task.dto.AddTask;
import com.arthManager.task.dto.TaskDto;
import com.arthManager.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tasks")
@AllArgsConstructor
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public Page<TaskDto> getAllTasks(
            @RequestParam(value = "date", required = false) String dateString,
            @RequestParam(value = "month", required = false) String monthString,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @AuthenticationPrincipal(expression = "username") String username) {
        try {
            return taskService.getAllTasks(username, dateString, monthString, year, page, size);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching tasks: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTask(
            @Valid @RequestBody AddTask addTask,
            @AuthenticationPrincipal(expression = "username") String username) {
        try {
            taskService.createTask(addTask, username);
            return ResponseEntity.ok("Task created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating task: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal(expression = "username") String username) {
        try {
            TaskDto taskDto = taskService.getTaskById(id, username);
            if (taskDto == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(taskDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable("id") Long id,
            @RequestBody TaskDto taskDto,
            @AuthenticationPrincipal(expression = "username") String username) {
        try {
            TaskDto updatedTask = taskService.updateTask(id, taskDto, username);
            if (updatedTask == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<TaskDto> completeTask(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal(expression = "username") String username) {
        try {
            TaskDto completedTask = taskService.completeTask(id, username);
            if (completedTask == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(completedTask);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal(expression = "username") String username) {
        try {
            taskService.deleteTask(id, username);
            return ResponseEntity.ok("Task deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting task: " + e.getMessage());
        }
    }
}