package com.arthManager.task.controller;


import com.arthManager.task.dto.AddTask;
import com.arthManager.task.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.web.bind.annotation.*;

//@EnableGlobalAuthentication
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tasks")
@AllArgsConstructor
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/create")
//    @PreAuthorize("hasRole('USER')")
//    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> createTask(@RequestBody AddTask addTask) {
        try {
            taskService.createTask(addTask);
            return ResponseEntity.ok("Task created successfully");
        }
        catch(Exception e){
            return ResponseEntity.status(500).body("Error creating task: " + e.getMessage());
        }
    }

}
