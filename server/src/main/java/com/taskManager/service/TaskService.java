package com.taskManager.service;

import com.taskManager.exception.UserNotFoundException;
import com.taskManager.model.Task;
import com.taskManager.model.User;
import com.taskManager.repository.TaskRepository;
import com.taskManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Task addTask(Task task, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + userId + " not found"));

        task.setUser(user);
        return taskRepository.save(task);
    }

    public List<Task> getUpcomingTasks(Long userId) {
        validateUserExists(userId);
        LocalDate today = LocalDate.now();
        return taskRepository.findByUserIdAndDueDateBetween(userId, today, today.plusDays(7));
    }

    public List<Task> getTasksByCategory(Long userId, String category) {
        validateUserExists(userId);
        return taskRepository.findByUserIdAndCategory(userId, category);
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User with ID " + userId + " not found");
        }
    }
}
