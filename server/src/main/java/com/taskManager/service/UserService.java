package com.taskManager.service;

import com.taskManager.exception.UserNotFoundException;
import com.taskManager.model.User;
import com.taskManager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // Register a new user with password hashing
    @Transactional
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Find user by username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Find user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));
    }

    // Find user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));
    }

    // Update user details
    @Transactional
    public User updateUser(Long id, User updatedUser) {
        User user = getUserById(id); // Throws UserNotFoundException if not found

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(user);
    }

    // Delete user by ID
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User with ID " + id + " not found");
        }
        userRepository.deleteById(id);
    }
}














// package com.taskManager.service;

// import com.taskManager.exception.UserNotFoundException;
// import com.taskManager.model.User;
// import com.taskManager.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.Optional;

// @Service
// public class UserService {

//     private final UserRepository userRepository;
//     private final PasswordEncoder passwordEncoder;

//     @Autowired
//     public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//         this.userRepository = userRepository;
//         this.passwordEncoder = passwordEncoder;
//     }

//     // Create a new user (with password hashing)
//     @Transactional
//     public User registerUser(User user) {
//         if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//             throw new IllegalArgumentException("Email is already in use.");
//         }

//         user.setPassword(passwordEncoder.encode(user.getPassword()));
//         return userRepository.save(user);
//     }

//     // Find user by email
//     public User getUserByEmail(String email) {
//         return userRepository.findByEmail(email)
//                 .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));
//     }

//     // Find user by ID
//     public User getUserById(Long id) {
//         return userRepository.findById(id)
//                 .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));
//     }

//     // Update user details
//     @Transactional
//     public User updateUser(Long id, User updatedUser) {
//         User user = getUserById(id); // Throws UserNotFoundException if not found

//         user.setUsername(updatedUser.getUsername());
//         user.setEmail(updatedUser.getEmail());

//         if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
//             user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
//         }

//         return userRepository.save(user);
//     }

//     // Delete user by ID
//     @Transactional
//     public void deleteUser(Long id) {
//         if (!userRepository.existsById(id)) {
//             throw new UserNotFoundException("User with ID " + id + " not found");
//         }
//         userRepository.deleteById(id);
//     }
// }
