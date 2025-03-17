package com.arthManager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.arthManager.model.Task;
import com.arthManager.model.User;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserAndDueDate(User user, LocalDate dueDate);

    // Find tasks by user, due date, and completion status
    List<Task> findByUserAndDueDateAndCompleted(User user, LocalDate dueDate, boolean completed);

    Task findByUserAndId(User user, Long id);

    List<Task> findByUser(User user);
    Task getById(Long id);


    int countByCompleted(boolean completed);

}


