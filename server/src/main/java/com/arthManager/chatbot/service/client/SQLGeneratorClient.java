package com.arthManager.chatbot.service.client;

import com.arthManager.chatbot.dto.SQLGeneratorRequest;
import com.arthManager.chatbot.dto.SQLGeneratorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.time.Duration;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class SQLGeneratorClient {

    private final RestTemplate restTemplate;

    @Value("${sql-generator.base-url:http://localhost:8000}")
    private String sqlGeneratorBaseUrl;

    @Value("${sql-generator.timeout:30}")
    private int timeoutSeconds;

    public SQLGeneratorResponse generateSQL(SQLGeneratorRequest request) {
        try {
            log.info("Sending request to SQL generator: {}", request.getQueryDescription());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<SQLGeneratorRequest> entity = new HttpEntity<>(request, headers);

            String url = sqlGeneratorBaseUrl + "/generate-sql";

            ResponseEntity<SQLGeneratorResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    SQLGeneratorResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("Successfully received SQL response with confidence: {}",
                        response.getBody().getConfidence());
                return response.getBody();
            } else {
                log.warn("SQL generator returned non-OK status: {}", response.getStatusCode());
                return null;
            }

        } catch (RestClientException e) {
            log.error("Error calling SQL generator service: ", e);
            return null;
        } catch (Exception e) {
            log.error("Unexpected error in SQL generator client: ", e);
            return null;
        }
    }

    public boolean isHealthy() {
        try {
            String url = sqlGeneratorBaseUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> healthData = response.getBody();
                Boolean llmAvailable = (Boolean) healthData.get("llm_available");
                return Boolean.TRUE.equals(llmAvailable);
            }

            return false;
        } catch (Exception e) {
            log.error("Health check failed for SQL generator: ", e);
            return false;
        }
    }
}