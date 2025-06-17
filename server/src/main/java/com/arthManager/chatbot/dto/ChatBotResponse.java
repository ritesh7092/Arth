package com.arthManager.chatbot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatBotResponse {

    private String message;
    private boolean success;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    private String queryType;
    private Object data;

    public ChatBotResponse(String message, boolean success){
        this.message = message;
        this.success = success;
        this.timestamp = LocalDateTime.now();
    }

    public ChatBotResponse(String message, boolean success, String queryType) {
        this.message = message;
        this.success = success;
        this.queryType = queryType;
        this.timestamp = LocalDateTime.now();
    }

    public ChatBotResponse(String message, boolean success, String queryType, Object data) {
        this.message = message;
        this.success = success;
        this.queryType = queryType;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

}
