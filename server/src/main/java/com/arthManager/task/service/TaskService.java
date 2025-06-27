package com.arthManager.task.service;

import com.arthManager.task.dto.AddTask;
import com.arthManager.task.dto.TaskDto;
import com.arthManager.task.model.Task;
import com.arthManager.task.repository.TaskRepository;
import com.arthManager.user.model.User;
import com.arthManager.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Get user by username
    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public Page<TaskDto> getAllTasks(String username, String dateString, String monthString, Integer year, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dateAdded").descending());
        User user = getUserByUsername(username);

        if (dateString != null && !dateString.isEmpty()) {
            LocalDate date = LocalDate.parse(dateString);
            Page<Task> entityPage = taskRepository.findByUserAndDateAdded(user, date, pageable);
            return entityPage.map(e -> modelMapper.map(e, TaskDto.class));
        } else if (monthString != null && year != null && !"All".equals(monthString)) {
            int monthIndex = Month.valueOf(monthString.toUpperCase()).getValue();
            LocalDate startDate = LocalDate.of(year, monthIndex, 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            Page<Task> entityPage = taskRepository.findByUserAndDateAddedBetween(user, startDate, endDate, pageable);
            return entityPage.map(e -> modelMapper.map(e, TaskDto.class));
        } else {
            Page<Task> entityPage = taskRepository.findByUser(user, pageable);
            return entityPage.map(e -> modelMapper.map(e, TaskDto.class));
        }
    }

    public Task createTask(AddTask addTask, String username) {
        User user = getUserByUsername(username);

        Task task = new Task();
        task.setUser(user);
        task.setTitle(addTask.getTitle());
        task.setDescription(addTask.getDescription());
        task.setPriority(addTask.getPriority());
        task.setDueDate(addTask.getDueDate());
        task.setType(addTask.getType());
        task.setCompleted(false); // By default, a new task is not completed
        task.setDateAdded(LocalDate.now()); // Set the current date as the dateAdded
        task.setEmailReminder(addTask.getEmailReminder());

        return taskRepository.save(task);
    }

    public TaskDto getTaskById(Long id, String username) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        return modelMapper.map(task, TaskDto.class);
    }

    public TaskDto updateTask(Long id, TaskDto updatedTask, String username) {
        User user = getUserByUsername(username);
        Task existingTask = taskRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        modelMapper.map(updatedTask, existingTask);
        Task saved = taskRepository.save(existingTask);

        return modelMapper.map(saved, TaskDto.class);
    }

    public TaskDto completeTask(Long id, String username) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        task.setCompleted(true);
        Task savedTask = taskRepository.save(task);
        return modelMapper.map(savedTask, TaskDto.class);
    }

    public void deleteTask(Long id, String username) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        taskRepository.delete(task);
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> executeCustomQuery(String sql) {
        try {
            log.info("Executing task query: {}", sql);
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            log.error("Error executing task query: {}", sql, e);
            throw new RuntimeException("Failed to execute task query", e);
        }
    }

    public Task save(Task task) {
        try {
            return taskRepository.save(task);
        } catch (Exception e) {
            log.error("Error saving task: ", e);
            throw new RuntimeException("Failed to save task", e);
        }
    }
}