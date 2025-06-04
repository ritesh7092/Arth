package com.arthManager.task.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.arthManager.task.model.Task;
import com.arthManager.user.model.User;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserAndDueDateBetween(User user, LocalDate startDate, LocalDate endDate);
    List<Task> findByUserAndDueDateBefore(User user, LocalDate date);
    List<Task> findByUserAndDueDateAfter(User user, LocalDate date);
    List<Task> findByUserAndCompleted(User user, boolean completed);

}


