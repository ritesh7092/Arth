package com.arthManager.task.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.arthManager.task.model.Task;
import com.arthManager.user.model.User;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserAndDueDate(User user, LocalDate dueDate);

    // Find tasks by user, due date, and completion status
    List<Task> findByUserAndDueDateAndCompleted(User user, LocalDate dueDate, boolean completed);

    Task findByUserAndId(User user, Long id);

    List<Task> findByUser(User user);
    Task getById(Long id);


    int countByCompleted(boolean completed);

}


