package com.arthManager.chatbot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SQLGeneratorResponse {

    @JsonProperty("sql_query")
    private String sqlQuery;

    private String explanation;
    private double confidence;

    @JsonProperty("generated_at")
    private LocalDateTime generatedAt;

    private List<String> warnings;
}
