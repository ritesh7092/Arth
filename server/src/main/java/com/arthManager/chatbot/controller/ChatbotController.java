package com.arthManager.chatbot.controller;

import com.arthManager.chatbot.dto.ChatbotRequest;
import com.arthManager.chatbot.dto.ChatbotResponse;
import com.arthManager.chatbot.service.ChatbotService;
import com.arthManager.security.jwt.JwtUtils;
import io.github.bucket4j.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173"})
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final JwtUtils jwtTokenProvider;

    // Rate limiting - 10 requests per minute per user
    private final ConcurrentHashMap<Long, Bucket> userBuckets = new ConcurrentHashMap<>();

    @PostMapping("/query")
    public ResponseEntity<?> handleChatbotQuery(
            @Valid @RequestBody ChatbotRequest request,
            HttpServletRequest httpRequest) {

        try {
            // Extract and validate JWT token
            String token = extractTokenFromRequest(httpRequest);
            if (token == null || !jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ChatbotResponse("Authentication failed. Please login again.", false));
            }

            // Get user ID from token
            Long userId = jwtTokenProvider.getUserIdFromToken(token);

            // Apply rate limiting
            if (!isRequestAllowed(userId)) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(new ChatbotResponse("Too many requests. Please try again later.", false));
            }

            log.info("Processing chatbot query for user: {} - Query: {}", userId, request.getQuery());

            // Process the query
            ChatbotResponse response = chatbotService.processQuery(request.getQuery(), userId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error processing chatbot query: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ChatbotResponse("Sorry, I encountered an error while processing your request. Please try again.", false));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(chatbotService.getHealthStatus());
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private boolean isRequestAllowed(Long userId) {
        Bucket bucket = userBuckets.computeIfAbsent(userId, this::createNewBucket);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        return probe.isConsumed();
    }

    private Bucket createNewBucket(Long userId) {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket4j.builder()
                .addLimit(limit)
                .build();
    }

//    private Bucket createNewBucket(Long userId) {
//        return Bucket.builder()
//                .addLimit(limit -> limit.capacity(10).refillGreedy(10, java.time.Duration.ofMinutes(1)))
//                .build();
//    }
}