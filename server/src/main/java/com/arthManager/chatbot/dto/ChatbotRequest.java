package com.arthManager.chatbot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotRequest {

    @NotBlank(message = "Query cannot be empty")
    @Size(min = 3, max = 500, message = "Query must be between 3 and 500 characters")
    private String query; // The user's query or question

}
