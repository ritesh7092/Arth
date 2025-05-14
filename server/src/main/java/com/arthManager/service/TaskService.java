package com.arthManager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.arthManager.model.Task;
import com.arthManager.model.User;
import com.arthManager.repository.TaskRepository;
import com.arthManager.repository.UserRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // Method to save a new task
    public Task saveTask(Task task) {
        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Get the username
        String username = authentication.getName();

        // Get the user object
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );

        // Set the user who is saving the task
        task.setUser(user);

        // Set the current date as the dateAdded when the task is saved
        task.setDateAdded(LocalDate.now());
        return taskRepository.save(task);
    }

    // Get today's tasks for user
    public List<Task> getTodayTasksForCurrentUser() {
        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Get the user object
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );

        // Get current date
        LocalDate currentDate = LocalDate.now();

        // Get Task list
        List<Task> taskListForToday = new ArrayList<>();

        taskListForToday = taskRepository.findByUserAndDueDateAndCompleted(user, currentDate, false);

        return taskListForToday;

    }

    // Method to get all tasks for current user
    public List<Task> getAllTasksForCurrentUser() {
        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Get the username
        String username = authentication.getName();

        // Get the user object
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );

        return taskRepository.findByUser(user);
    }

    // Method to mark a task as done
    public boolean markTaskAsDone(Long taskId) {

        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Get the username
        String username = authentication.getName();
        // Get the user object
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );

        // Get the Task with user combined
        Task task = taskRepository.findByUserAndId(user, taskId);
        if (task != null && !task.isCompleted()) {
            task.setCompletionDate(LocalDate.now());
            task.setCompleted(true);
            taskRepository.save(task);
            return true;
        }

        // Task not found, not owned by user, or already marked done
        return false;
    }

    // Method to get a task which is not done
    public Task getTaskById(Long taskId) {
        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Get the username
        String username = authentication.getName();
        // Get the user object
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );
        // Get the Task with user combined
        Task task = taskRepository.findByUserAndId(user, taskId);
        if (task != null && !task.isCompleted()) {
            return task;
        }
        // Task not found, not owned by user
        return null;
    }

    // Method to get a task which does not look at the done flag
    public Task getTaskByIdAny(Long taskId) {
        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Get the username
        String username = authentication.getName();

        // Get the user object
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );

        // Get the Task with user combined
        Task task = taskRepository.findByUserAndId(user, taskId);

        if (task != null) {
            return task;
        }

        // Task not found, not owned by user
        return null;
    }

    // Method to update an existing task
    public boolean updateTaskForUser(Task task) {
        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Get the username
        String username = authentication.getName();

        // Get the user object
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );

        // Get task in database
        Task taskInDb = taskRepository.getById(task.getId());

        // if the person who wants to update is not same as the user who created the
        // task
        if (user != null && !user.getUsername().equals(taskInDb.getUser().getUsername())) {
            return false;
        }

        Task existingTask = taskRepository.findByUserAndId(user, task.getId());
        if (existingTask != null) {
            existingTask.setTitle(task.getTitle());
            existingTask.setDescription(task.getDescription());
            existingTask.setPriority(task.getPriority());
            existingTask.setDueDate(task.getDueDate());
            existingTask.setType(task.getType());

            // Update the current date as the dateAdded when the task is updated
            existingTask.setDateAdded(LocalDate.now());

            Task taskUpdated = taskRepository.save(existingTask);

            if (taskUpdated != null) {
                return true;
            }
        }

        return false;
    }

    // Method to update an existing task
    public boolean deleteTask(Task task) {

        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Get the username
        String username = authentication.getName();

        // Get the user object
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );

        // Get task in database
        Task taskInDb = taskRepository.getById(task.getId());

        // if the person who wants to update is not same as the user who created the
        // task
        if (user != null && !user.getUsername().equals(taskInDb.getUser().getUsername())) {
            return false;
        }

        Task existingTask = taskRepository.findByUserAndId(task.getUser(), task.getId());
        if (existingTask != null) {
            taskRepository.delete(existingTask);
            return true;
        }

        return false;
    }

    public int countByCompleted(boolean completedStatus) {
        return taskRepository.countByCompleted(completedStatus);

    }
}
