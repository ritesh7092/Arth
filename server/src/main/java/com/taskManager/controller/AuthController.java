package com.taskManager.controller;

import com.taskManager.dto.AuthRequest;
import com.taskManager.dto.AuthResponse;
import com.taskManager.model.User;
import com.taskManager.config.JwtUtil;
import com.taskManager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            String token = jwtUtil.generateToken(request.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(new AuthResponse(null, "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Username already exists"));
        }
        userService.registerUser(user);
        return ResponseEntity.ok(new AuthResponse(null, "User registered successfully"));
    }
}











// package com.taskManager.controller;

// import com.taskManager.service.AuthService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {
//     @Autowired
//     private AuthService authService;

//     @PostMapping("/signup")
//     public String register(@RequestBody Map<String, String> request) {
//         return authService.registerUser(request.get("username"), request.get("email"), request.get("password"));
//     }

//     @PostMapping("/login")
//     public Map<String, String> login(@RequestBody Map<String, String> request) {
//         String token = authService.authenticateUser(request.get("username"), request.get("password"));
//         if (token != null) {
//             return Map.of("token", token);
//         }
//         return Map.of("message", "Invalid credentials");
//     }
// }
