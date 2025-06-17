package com.arthManager.chatbot.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SQLGeneratorRequest {

    private String queryDescription;
    private String databaseSchema;
    private String databaseType;
    private List<String> tableNames;
}
