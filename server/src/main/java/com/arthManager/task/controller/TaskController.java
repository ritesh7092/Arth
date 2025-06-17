package com.arthManager.task.controller;


import com.arthManager.task.dto.AddTask;
import com.arthManager.task.dto.TaskDto;
import com.arthManager.task.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    @GetMapping
    public Page<TaskDto> getAllTasks(
            @RequestParam(value = "date", required = false) String dateString,
            @RequestParam(value = "month", required = false) String monthString,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
            ) {
        try {
            return taskService.getAllTasks(dateString, monthString, year, page, size);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching tasks: " + e.getMessage());
        }
    }

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

    // Add more endpoints as needed for retrieving, updating, and deleting tasks
     @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable("id") Long id) {
        try {
            TaskDto taskDto = taskService.getTaskById(id);
            if (taskDto == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(taskDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/update/{id}")
    public  ResponseEntity<TaskDto> updateTask(@PathVariable("id") Long id,
                                               @RequestBody TaskDto taskDto){
        try {
            TaskDto updatedTask = taskService.updateTask(id, taskDto);
            if (updatedTask == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<TaskDto> completeTask(@PathVariable("id") Long id) {
        try {
            TaskDto completedTask = taskService.completeTask(id);
            if (completedTask == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(completedTask);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable("id") Long id){
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok("Task deleted succesfully");
        }
        catch (Exception e){
            return ResponseEntity.status(500).body("Error deleting task: " + e.getMessage());
        }
    }

}
