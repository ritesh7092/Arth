package com.taskManager.controller;

import com.taskManager.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public String register(@RequestBody Map<String, String> request) {
        return authService.registerUser(request.get("username"), request.get("email"), request.get("password"));
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        String token = authService.authenticateUser(request.get("username"), request.get("password"));
        if (token != null) {
            return Map.of("token", token);
        }
        return Map.of("message", "Invalid credentials");
    }
}
