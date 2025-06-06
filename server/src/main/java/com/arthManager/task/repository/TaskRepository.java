package com.arthManager.task.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.arthManager.task.model.Task;
import com.arthManager.user.model.User;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserAndDueDateBetween(User user, LocalDate startDate, LocalDate endDate);
    List<Task> findByUserAndDueDateBefore(User user, LocalDate date);
    List<Task> findByUserAndDueDateAfter(User user, LocalDate date);
    List<Task> findByUserAndCompleted(User user, boolean completed);

    Page<Task> findByDateAdded(LocalDate date, Pageable pageable);

    Page<Task> findByDateAddedBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<Task> findByUserAndDateAdded(User user, LocalDate date, Pageable pageable);



      Optional<Task> findByUserAndId(User user, Long id);

    Page<Task> findByUserAndDateAddedBetween(User user, LocalDate startDate, LocalDate endDate, Pageable pageable);
}


