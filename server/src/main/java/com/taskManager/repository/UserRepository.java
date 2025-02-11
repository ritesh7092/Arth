package com.taskManager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taskManager.model.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndPassword(String username, String password);
    Optional<User> findByUserByEmailAndPassword(String email, String password);
}
