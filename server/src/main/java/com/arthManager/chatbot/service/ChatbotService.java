package com.arthManager.chatbot.service;

import com.arthManager.chatbot.dto.ChatbotResponse;
import com.arthManager.chatbot.dto.SQLGeneratorRequest;
import com.arthManager.chatbot.dto.SQLGeneratorResponse;
import com.arthManager.chatbot.service.client.SQLGeneratorClient;
import com.arthManager.finance.model.Finance;
import com.arthManager.finance.service.FinanceService;
import com.arthManager.task.model.Task;
import com.arthManager.task.service.TaskService;
import com.arthManager.user.model.User;
import com.arthManager.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataAccessException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {

    private final SQLGeneratorClient sqlGeneratorClient;
    private final FinanceService financeService;
    private final TaskService taskService;
    private final UserService userService;
    private final QueryValidator queryValidator;
    private final SchemaProvider schemaProvider;

    @Transactional
    public ChatbotResponse processQuery(String userQuery, Long userId) {
        try {
            log.info("Processing query for user {}: {}", userId, userQuery);

            // Validate user exists
            User user = userService.findById(userId);
            if (user == null) {
                return new ChatbotResponse("User not found. Please login again.", false);
            }

            // Determine query type and validate
            QueryType queryType = determineQueryType(userQuery);

            // Check if it's a create operation
            if (isCreateOperation(userQuery)) {
                return handleCreateOperation(userQuery, user, queryType);
            }

            // For read operations, use SQL generator
            return handleReadOperation(userQuery, user, queryType);

        } catch (Exception e) {
            log.error("Error processing chatbot query for user {}: ", userId, e);
            return new ChatbotResponse("I encountered an error while processing your request. Please try again with a simpler query.", false);
        }
    }

    private ChatbotResponse handleReadOperation(String userQuery, User user, QueryType queryType) {
        try {
            // Build context-aware prompt with current date
            String contextualPrompt = buildContextualPrompt(userQuery, user, queryType);
            String schema = schemaProvider.getSchemaForQueryType(queryType);

            // Create SQL generator request
            SQLGeneratorRequest sqlRequest = SQLGeneratorRequest.builder()
                    .queryDescription(contextualPrompt)
                    .databaseSchema(schema)
                    .databaseType("mysql")  // Changed from postgresql to mysql
                    .tableNames(getRelevantTableNames(queryType))
                    .build();

            // Get SQL from generator
            SQLGeneratorResponse sqlResponse = sqlGeneratorClient.generateSQL(sqlRequest);

            if (sqlResponse == null || sqlResponse.getSqlQuery() == null) {
                return new ChatbotResponse("I couldn't generate a proper query for your request. Please try rephrasing.", false);
            }

            log.info("Generated SQL: {}", sqlResponse.getSqlQuery());

            // Validate and sanitize SQL
            String sanitizedSQL = queryValidator.validateAndSanitizeSQL(
                    sqlResponse.getSqlQuery(), queryType, user.getId());

            if (sanitizedSQL == null) {
                return new ChatbotResponse("I cannot execute this type of query for security reasons. Please try a different request.", false);
            }

            log.info("Sanitized SQL: {}", sanitizedSQL);

            // Execute query and format response
            return executeQueryAndFormatResponse(sanitizedSQL, userQuery, queryType, user);

        } catch (Exception e) {
            log.error("Error in read operation: ", e);
            return new ChatbotResponse("I encountered an error while fetching your data. Please try again.", false);
        }
    }

    private QueryType determineQueryType(String query) {
        String lowerQuery = query.toLowerCase();

        if (lowerQuery.contains("task") || lowerQuery.contains("todo") || lowerQuery.contains("assignment")
                || lowerQuery.contains("deadline") || lowerQuery.contains("due") || lowerQuery.contains("complete")
                || lowerQuery.contains("schedule")) {
            return QueryType.TASK;
        } else if (lowerQuery.contains("finance") || lowerQuery.contains("money") || lowerQuery.contains("expense")
                || lowerQuery.contains("income") || lowerQuery.contains("spend") || lowerQuery.contains("payment")
                || lowerQuery.contains("transaction") || lowerQuery.contains("loan") || lowerQuery.contains("borrow")
                || lowerQuery.contains("budget") || lowerQuery.contains("cost") || lowerQuery.contains("earning")) {
            return QueryType.FINANCE;
        }

        // Default to finance if unclear
        return QueryType.FINANCE;
    }

    private boolean isCreateOperation(String query) {
        String lowerQuery = query.toLowerCase();
        return lowerQuery.contains("add") || lowerQuery.contains("create") || lowerQuery.contains("save")
                || lowerQuery.contains("record") || lowerQuery.contains("new") || lowerQuery.contains("schedule");
    }

    private ChatbotResponse handleCreateOperation(String query, User user, QueryType queryType) {
        try {
            // Enhanced query with current date context
            String enhancedQuery = enhanceQueryWithDateContext(query);

            if (queryType == QueryType.FINANCE) {
                return handleFinanceCreation(enhancedQuery, user);
            } else if (queryType == QueryType.TASK) {
                return handleTaskCreation(enhancedQuery, user);
            }

            return new ChatbotResponse("I'm not sure what you want to create. Please specify if it's a finance record or a task.", false);

        } catch (Exception e) {
            log.error("Error handling create operation: ", e);
            return new ChatbotResponse("I couldn't create the record. Please provide more specific details.", false);
        }
    }

    private String enhanceQueryWithDateContext(String query) {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        LocalDate yesterday = today.minusDays(1);

        StringBuilder context = new StringBuilder();
        context.append("Current date context: ");
        context.append("Today is ").append(today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        context.append(", Tomorrow is ").append(tomorrow.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        context.append(", Yesterday was ").append(yesterday.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        context.append(". User query: ").append(query);

        return context.toString();
    }

    private ChatbotResponse handleFinanceCreation(String query, User user) {
        try {
            // First try to generate SQL for parsing complex financial data
            String contextualPrompt = buildFinanceCreationPrompt(query, user);
            String schema = schemaProvider.getSchemaForQueryType(QueryType.FINANCE);

            SQLGeneratorRequest sqlRequest = SQLGeneratorRequest.builder()
                    .queryDescription(contextualPrompt)
                    .databaseSchema(schema)
                    .databaseType("mysql")
                    .tableNames(Arrays.asList("finance"))
                    .build();

            // Extract finance details from query using enhanced patterns
            FinanceDetails details = extractFinanceDetails(query);

            if (details.amount == null) {
                return new ChatbotResponse("Please specify the amount for the finance record.", false);
            }

            Finance finance = new Finance();
            finance.setUser(user);
            finance.setAmount(details.amount);
            finance.setDescription(details.description != null ? details.description : "Added via chatbot");
            finance.setCategory(details.category != null ? details.category : "General");
            finance.setTransactionType(details.transactionType != null ? details.transactionType : Finance.TransactionType.EXPENSE);
            finance.setTransactionDate(details.date != null ? details.date : LocalDate.now());
            finance.setPaymentMethod(details.paymentMethod);
            finance.setCounterparty(details.counterparty);

            Finance savedFinance = financeService.save(finance);

            return new ChatbotResponse(
                    String.format("✅ Finance record created successfully!\n" +
                                    "Amount: ₹%.2f\n" +
                                    "Type: %s\n" +
                                    "Category: %s\n" +
                                    "Date: %s\n" +
                                    "Description: %s",
                            savedFinance.getAmount(),
                            savedFinance.getTransactionType(),
                            savedFinance.getCategory(),
                            savedFinance.getTransactionDate(),
                            savedFinance.getDescription()),
                    true
            );

        } catch (Exception e) {
            log.error("Error creating finance record: ", e);
            return new ChatbotResponse("I couldn't create the finance record. Please check the details and try again.", false);
        }
    }

    private ChatbotResponse handleTaskCreation(String query, User user) {
        try {
            TaskDetails details = extractTaskDetails(query);

            if (details.title == null || details.title.trim().isEmpty()) {
                return new ChatbotResponse("Please specify a title for the task.", false);
            }

            Task task = new Task();
            task.setUser(user);
            task.setTitle(details.title);
            task.setDescription(details.description != null ? details.description : "Added via chatbot");
            task.setPriority(details.priority != null ? details.priority : "medium");
            task.setType(details.type != null ? details.type : "personal");
            task.setDueDate(details.dueDate);
            task.setEmailReminder(details.emailReminder);

            Task savedTask = taskService.save(task);

            return new ChatbotResponse(
                    String.format("✅ Task created successfully!\n" +
                                    "Title: %s\n" +
                                    "Priority: %s\n" +
                                    "Type: %s\n" +
                                    "Due Date: %s\n" +
                                    "Description: %s",
                            savedTask.getTitle(),
                            savedTask.getPriority(),
                            savedTask.getType(),
                            savedTask.getDueDate() != null ? savedTask.getDueDate().toString() : "Not set",
                            savedTask.getDescription()),
                    true
            );

        } catch (Exception e) {
            log.error("Error creating task: ", e);
            return new ChatbotResponse("I couldn't create the task. Please check the details and try again.", false);
        }
    }

    private String buildContextualPrompt(String userQuery, User user, QueryType queryType) {
        LocalDate today = LocalDate.now();
        StringBuilder prompt = new StringBuilder();

        prompt.append("Current date: ").append(today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))).append("\n");
        prompt.append("User query: ").append(userQuery).append("\n");
        prompt.append("User ID: ").append(user.getId()).append("\n");
        prompt.append("Context: This is a ").append(queryType.name().toLowerCase()).append(" related query for user data.\n");
        prompt.append("Generate a SQL query that filters data by user_id = ").append(user.getId()).append("\n");

        if (queryType == QueryType.FINANCE) {
            prompt.append("For finance queries, consider transaction types: INCOME, EXPENSE, LOAN, BORROW\n");
            prompt.append("Available categories include various expense/income categories\n");
            prompt.append("Date-related terms: 'today', 'yesterday', 'this month', 'last month', 'this year' should be interpreted relative to ").append(today).append("\n");
        } else if (queryType == QueryType.TASK) {
            prompt.append("For task queries, consider priority levels: high, medium, low\n");
            prompt.append("Task types: official, family, personal\n");
            prompt.append("Task completion status: completed (true/false)\n");
            prompt.append("Date-related terms: 'today', 'tomorrow', 'this week', 'next week' should be interpreted relative to ").append(today).append("\n");
        }

        return prompt.toString();
    }

    private String buildFinanceCreationPrompt(String userQuery, User user) {
        LocalDate today = LocalDate.now();
        StringBuilder prompt = new StringBuilder();

        prompt.append("Current date: ").append(today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))).append("\n");
        prompt.append("User wants to create a finance record based on: ").append(userQuery).append("\n");
        prompt.append("Extract financial information like amount, category, transaction type, and date.\n");
        prompt.append("Date references like 'today', 'yesterday', 'tomorrow' should be relative to ").append(today).append("\n");

        return prompt.toString();
    }

    private List<String> getRelevantTableNames(QueryType queryType) {
        if (queryType == QueryType.FINANCE) {
            return Arrays.asList("finance", "users");
        } else if (queryType == QueryType.TASK) {
            return Arrays.asList("task", "users");
        }
        return Arrays.asList("finance", "task", "users");
    }

    @SuppressWarnings("unchecked")
    private ChatbotResponse executeQueryAndFormatResponse(String sql, String originalQuery, QueryType queryType, User user) {
        try {
            List<Map<String, Object>> results;

            if (queryType == QueryType.FINANCE) {
                results = financeService.executeCustomQuery(sql);
            } else if (queryType == QueryType.TASK) {
                results = taskService.executeCustomQuery(sql);
            } else {
                return new ChatbotResponse("I couldn't determine what type of data you're looking for.", false);
            }

            if (results == null || results.isEmpty()) {
                return new ChatbotResponse("I didn't find any data matching your query. Try asking about different time periods or categories.", false);
            }

            String formattedResponse = formatQueryResults(results, queryType, originalQuery);
            return new ChatbotResponse(formattedResponse, true);

        } catch (DataAccessException e) {
            log.error("Database error executing query: {}", sql, e);
            return new ChatbotResponse("I encountered a database error. Please try a simpler query.", false);
        } catch (Exception e) {
            log.error("Error executing query: {}", sql, e);
            return new ChatbotResponse("I couldn't execute your query. Please try rephrasing your request.", false);
        }
    }

    private String formatQueryResults(List<Map<String, Object>> results, QueryType queryType, String originalQuery) {
        StringBuilder response = new StringBuilder();

        if (queryType == QueryType.FINANCE) {
            response.append(formatFinanceResults(results, originalQuery));
        } else if (queryType == QueryType.TASK) {
            response.append(formatTaskResults(results, originalQuery));
        }

        return response.toString();
    }

    private String formatFinanceResults(List<Map<String, Object>> results, String originalQuery) {
        StringBuilder sb = new StringBuilder();

        // Check if it's a summary query (contains aggregation)
        boolean isSummary = results.get(0).containsKey("total") || results.get(0).containsKey("sum") ||
                results.get(0).containsKey("count") || results.get(0).containsKey("avg") ||
                results.get(0).containsKey("Total") || results.get(0).containsKey("Sum") ||
                results.get(0).containsKey("Count") || results.get(0).containsKey("Avg");

        if (isSummary) {
            sb.append("📊 Financial Summary:\n\n");
            for (Map<String, Object> row : results) {
                for (Map.Entry<String, Object> entry : row.entrySet()) {
                    String key = entry.getKey();
                    Object value = entry.getValue();

                    if (value instanceof BigDecimal || value instanceof Double || value instanceof Float) {
                        sb.append(String.format("%s: ₹%.2f\n", formatColumnName(key), value));
                    } else {
                        sb.append(String.format("%s: %s\n", formatColumnName(key), value));
                    }
                }
                sb.append("\n");
            }
        } else {
            sb.append("💰 Finance Records:\n\n");
            int count = 1;
            for (Map<String, Object> row : results) {
                sb.append(String.format("%d. ", count++));

                Object amount = row.get("amount");
                Object description = row.get("description");
                Object category = row.get("category");
                Object transactionType = row.get("transaction_type") != null ?
                        row.get("transaction_type") : row.get("transactiontype");
                Object date = row.get("transaction_date") != null ?
                        row.get("transaction_date") : row.get("transactiondate");

                if (amount != null) {
                    sb.append(String.format("₹%.2f", amount));
                }
                if (transactionType != null) {
                    sb.append(String.format(" (%s)", transactionType));
                }
                if (category != null) {
                    sb.append(String.format(" - %s", category));
                }
                if (description != null) {
                    sb.append(String.format(" - %s", description));
                }
                if (date != null) {
                    sb.append(String.format(" [%s]", date));
                }
                sb.append("\n");

                if (count > 10) { // Limit to 10 records
                    sb.append("... and more records\n");
                    break;
                }
            }
        }

        return sb.toString();
    }

    private String formatTaskResults(List<Map<String, Object>> results, String originalQuery) {
        StringBuilder sb = new StringBuilder();

        sb.append("📝 Task Information:\n\n");
        int count = 1;

        for (Map<String, Object> row : results) {
            sb.append(String.format("%d. ", count++));

            Object title = row.get("title");
            Object priority = row.get("priority");
            Object type = row.get("type");
            Object completed = row.get("completed");
            Object dueDate = row.get("due_date") != null ? row.get("due_date") : row.get("duedate");
            Object description = row.get("description");

            if (title != null) {
                sb.append(String.format("%s", title));
            }
            if (priority != null) {
                sb.append(String.format(" [%s priority]", priority));
            }
            if (type != null) {
                sb.append(String.format(" (%s)", type));
            }
            if (completed != null) {
                boolean isCompleted = Boolean.parseBoolean(completed.toString());
                sb.append(isCompleted ? " ✅" : " ⏳");
            }
            if (dueDate != null) {
                sb.append(String.format(" - Due: %s", dueDate));
            }
            if (description != null && !description.toString().equals("Added via chatbot")) {
                sb.append(String.format("\n   Description: %s", description));
            }
            sb.append("\n");

            if (count > 10) { // Limit to 10 records
                sb.append("... and more tasks\n");
                break;
            }
        }

        return sb.toString();
    }

    private String formatColumnName(String columnName) {
        return Arrays.stream(columnName.split("_"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .reduce((a, b) -> a + " " + b)
                .orElse(columnName);
    }

    // Enhanced helper methods for parsing create operations
    private FinanceDetails extractFinanceDetails(String query) {
        FinanceDetails details = new FinanceDetails();

        // Extract amount with enhanced patterns
        Pattern amountPattern = Pattern.compile(
                "(?:₹|rs\\.?|rupees?)\\s*(\\d+(?:\\.\\d{1,2})?)|\\b(\\d+(?:\\.\\d{1,2})?)\\s*(?:₹|rs\\.?|rupees?)|\\b(\\d+(?:\\.\\d{1,2})?)\\s*(?:dollars?|\\$)",
                Pattern.CASE_INSENSITIVE
        );
        Matcher amountMatcher = amountPattern.matcher(query);
        if (amountMatcher.find()) {
            String amountStr = amountMatcher.group(1) != null ? amountMatcher.group(1) :
                    amountMatcher.group(2) != null ? amountMatcher.group(2) : amountMatcher.group(3);
            try {
                details.amount = new BigDecimal(amountStr);
            } catch (NumberFormatException e) {
                log.warn("Failed to parse amount: {}", amountStr);
            }
        }

        // Extract transaction type
        String lowerQuery = query.toLowerCase();
        if (lowerQuery.contains("income") || lowerQuery.contains("earn") || lowerQuery.contains("salary") ||
                lowerQuery.contains("receive") || lowerQuery.contains("credit") || lowerQuery.contains("deposit")) {
            details.transactionType = Finance.TransactionType.INCOME;
        } else if (lowerQuery.contains("loan") || lowerQuery.contains("lend")) {
            details.transactionType = Finance.TransactionType.LOAN;
        } else if (lowerQuery.contains("borrow")) {
            details.transactionType = Finance.TransactionType.BORROW;
        } else {
            details.transactionType = Finance.TransactionType.EXPENSE;
        }

        // Enhanced category extraction
        extractCategory(lowerQuery, details);

        // Enhanced date extraction
        extractDate(query, details);

        // Extract description
        extractDescription(query, details);

        return details;
    }

    private void extractCategory(String lowerQuery, FinanceDetails details) {
        if (lowerQuery.contains("food") || lowerQuery.contains("restaurant") || lowerQuery.contains("grocery") ||
                lowerQuery.contains("meal") || lowerQuery.contains("dining")) {
            details.category = "Food";
        } else if (lowerQuery.contains("transport") || lowerQuery.contains("travel") || lowerQuery.contains("fuel") ||
                lowerQuery.contains("bus") || lowerQuery.contains("taxi") || lowerQuery.contains("uber")) {
            details.category = "Transportation";
        } else if (lowerQuery.contains("entertainment") || lowerQuery.contains("movie") || lowerQuery.contains("game") ||
                lowerQuery.contains("concert") || lowerQuery.contains("show")) {
            details.category = "Entertainment";
        } else if (lowerQuery.contains("utility") || lowerQuery.contains("electricity") || lowerQuery.contains("water") ||
                lowerQuery.contains("gas") || lowerQuery.contains("internet") || lowerQuery.contains("phone")) {
            details.category = "Utilities";
        } else if (lowerQuery.contains("shopping") || lowerQuery.contains("clothes") || lowerQuery.contains("apparel")) {
            details.category = "Shopping";
        } else if (lowerQuery.contains("health") || lowerQuery.contains("medical") || lowerQuery.contains("doctor") ||
                lowerQuery.contains("medicine") || lowerQuery.contains("hospital")) {
            details.category = "Healthcare";
        }
    }

    private void extractDate(String query, FinanceDetails details) {
        LocalDate today = LocalDate.now();
        String lowerQuery = query.toLowerCase();

        if (lowerQuery.contains("today")) {
            details.date = today;
        } else if (lowerQuery.contains("yesterday")) {
            details.date = today.minusDays(1);
        } else if (lowerQuery.contains("tomorrow")) {
            details.date = today.plusDays(1);
        } else {
            // Try to parse explicit dates
            Pattern datePattern = Pattern.compile("\\b(\\d{1,2})[-/](\\d{1,2})[-/](\\d{4})\\b");
            Matcher dateMatcher = datePattern.matcher(query);
            if (dateMatcher.find()) {
                try {
                    int day = Integer.parseInt(dateMatcher.group(1));
                    int month = Integer.parseInt(dateMatcher.group(2));
                    int year = Integer.parseInt(dateMatcher.group(3));
                    details.date = LocalDate.of(year, month, day);
                } catch (Exception e) {
                    log.warn("Failed to parse date from query: {}", query);
                }
            }
        }
    }

    private void extractDescription(String query, FinanceDetails details) {
        String[] descKeywords = {"for", "on", "description", "note", "regarding", "about"};
        for (String keyword : descKeywords) {
            int index = query.toLowerCase().indexOf(keyword);
            if (index != -1 && index < query.length() - keyword.length() - 1) {
                String possibleDesc = query.substring(index + keyword.length()).trim();
                if (possibleDesc.length() > 2 && possibleDesc.length() < 100) {
                    details.description = possibleDesc;
                    break;
                }
            }
        }
    }

    private TaskDetails extractTaskDetails(String query) {
        TaskDetails details = new TaskDetails();

        // Enhanced title extraction
        String lowerQuery = query.toLowerCase();
        String[] titleKeywords = {"schedule", "add task", "create task", "new task", "task", "add", "create"};

        for (String keyword : titleKeywords) {
            int index = lowerQuery.indexOf(keyword);
            if (index != -1) {
                String afterKeyword = query.substring(index + keyword.length()).trim();
                if (afterKeyword.length() > 0) {
                    // Take first meaningful part as title, but exclude date/time references
                    String[] words = afterKeyword.split("\\s+");
                    List<String> titleWords = new ArrayList<>();

                    for (String word : words) {
                        if (word.toLowerCase().matches("(for|on|at|tomorrow|today|yesterday|\\d{1,2}[-/]\\d{1,2}[-/]\\d{4})")) {
                            break;
                        }
                        titleWords.add(word);
                        if (titleWords.size() >= 6) break; // Limit title length
                    }

                    if (!titleWords.isEmpty()) {
                        details.title = String.join(" ", titleWords);
                        break;
                    }
                }
            }
        }

        // Extract priority
        if (lowerQuery.contains("high priority") || lowerQuery.contains("urgent") || lowerQuery.contains("important") ||
                lowerQuery.contains("critical")) {
            details.priority = "high";
        } else if (lowerQuery.contains("low priority") || lowerQuery.contains("later") || lowerQuery.contains("someday")) {
            details.priority = "low";
        } else {
            details.priority = "medium";
        }

        // Extract type
        if (lowerQuery.contains("work") || lowerQuery.contains("office") || lowerQuery.contains("official") ||
                lowerQuery.contains("business") || lowerQuery.contains("meeting")) {
            details.type = "official";
        } else if (lowerQuery.contains("family") || lowerQuery.contains("home") || lowerQuery.contains("parents") ||
                lowerQuery.contains("kids") || lowerQuery.contains("spouse")) {
            details.type = "family";
        } else {
            details.type = "personal";
        }

        // Enhanced due date extraction
        extractTaskDate(query, details);

        return details;
    }

    private void extractTaskDate(String query, TaskDetails details) {
        LocalDate today = LocalDate.now();
        String lowerQuery = query.toLowerCase();

        if (lowerQuery.contains("tomorrow")) {
            details.dueDate = today.plusDays(1);
        } else if (lowerQuery.contains("today")) {
            details.dueDate = today;
        } else if (lowerQuery.contains("next week")) {
            details.dueDate = today.plusWeeks(1);
        } else if (lowerQuery.contains("next month")) {
            details.dueDate = today.plusMonths(1);
        } else {
            // Try to parse explicit dates
            Pattern datePattern = Pattern.compile("\\b(\\d{1,2})[-/](\\d{1,2})[-/](\\d{4})\\b");
            Matcher dateMatcher = datePattern.matcher(query);
            if (dateMatcher.find()) {
                try {
                    int day = Integer.parseInt(dateMatcher.group(1));
                    int month = Integer.parseInt(dateMatcher.group(2));
                    int year = Integer.parseInt(dateMatcher.group(3));
                    details.dueDate = LocalDate.of(year, month, day);
                } catch (DateTimeParseException e) {
                    log.warn("Failed to parse date from query: {}", query);
                }
            }
        }
    }

    public Map<String, Object> getHealthStatus() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "healthy");
        health.put("sqlGeneratorAvailable", sqlGeneratorClient.isHealthy());
        health.put("timestamp", LocalDate.now());
        return health;
    }

    // Helper classes
    private static class FinanceDetails {
        BigDecimal amount;
        String description;
        String category;
        Finance.TransactionType transactionType;
        LocalDate date;
        String paymentMethod;
        String counterparty;
    }

    private static class TaskDetails {
        String title;
        String description;
        String priority;
        String type;
        LocalDate dueDate;
        boolean emailReminder = false;
    }

    public enum QueryType {
        FINANCE, TASK, GENERAL
    }
}


















//package com.arthManager.chatbot.service;
//
//import com.arthManager.chatbot.dto.ChatbotResponse;
//import com.arthManager.chatbot.dto.SQLGeneratorRequest;
//import com.arthManager.chatbot.dto.SQLGeneratorResponse;
//import com.arthManager.chatbot.service.client.SQLGeneratorClient;
//import com.arthManager.finance.model.Finance;
//import com.arthManager.finance.service.FinanceService;
//import com.arthManager.task.model.Task;
//import com.arthManager.task.service.TaskService;
//import com.arthManager.user.model.User;
//import com.arthManager.user.service.UserService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.dao.DataAccessException;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.time.format.DateTimeFormatter;
//import java.util.*;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class ChatbotService {
//
//    private final SQLGeneratorClient sqlGeneratorClient;
//    private final FinanceService financeService;
//    private final TaskService taskService;
//    private final UserService userService;
//    private final QueryValidator queryValidator;
//    private final SchemaProvider schemaProvider;
//
//    @Transactional
//    public ChatbotResponse processQuery(String userQuery, Long userId) {
//        try {
//            log.info("Processing query for user {}: {}", userId, userQuery);
//
//            // Determine query type and validate
//            QueryType queryType = determineQueryType(userQuery);
//
//            // Validate user exists
//            User user = userService.findById(userId);
//            if (user == null) {
//                return new ChatbotResponse("User not found. Please login again.", false);
//            }
//
//            // Check if it's a create operation
//            if (isCreateOperation(userQuery)) {
//                return handleCreateOperation(userQuery, user, queryType);
//            }
//
//            // Build context-aware prompt with schema
//            String contextualPrompt = buildContextualPrompt(userQuery, user, queryType);
//            String schema = schemaProvider.getSchemaForQueryType(queryType);
//
//            // Create SQL generator request
//            SQLGeneratorRequest sqlRequest = SQLGeneratorRequest.builder()
//                    .queryDescription(contextualPrompt)
//                    .databaseSchema(schema)
//                    .databaseType("postgresql")
//                    .tableNames(getRelevantTableNames(queryType))
//                    .build();
//
//            // Get SQL from generator
//            SQLGeneratorResponse sqlResponse = sqlGeneratorClient.generateSQL(sqlRequest);
//
//            if (sqlResponse == null || sqlResponse.getSqlQuery() == null) {
//                return new ChatbotResponse("I couldn't generate a proper query for your request. Please try rephrasing.", false);
//            }
//
//            // Validate and sanitize SQL
//            String sanitizedSQL = queryValidator.validateAndSanitizeSQL(sqlResponse.getSqlQuery(), queryType, userId);
//
//            if (sanitizedSQL == null) {
//                return new ChatbotResponse("I cannot execute this type of query for security reasons. Please try a different request.", false);
//            }
//
//            // Execute query and format response
//            return executeQueryAndFormatResponse(sanitizedSQL, userQuery, queryType, user);
//
//        } catch (Exception e) {
//            log.error("Error processing chatbot query for user {}: ", userId, e);
//            return new ChatbotResponse("I encountered an error while processing your request. Please try again with a simpler query.", false);
//        }
//    }
//
//    private QueryType determineQueryType(String query) {
//        String lowerQuery = query.toLowerCase();
//
//        if (lowerQuery.contains("task") || lowerQuery.contains("todo") || lowerQuery.contains("assignment")
//                || lowerQuery.contains("deadline") || lowerQuery.contains("due") || lowerQuery.contains("complete")) {
//            return QueryType.TASK;
//        } else if (lowerQuery.contains("finance") || lowerQuery.contains("money") || lowerQuery.contains("expense")
//                || lowerQuery.contains("income") || lowerQuery.contains("spend") || lowerQuery.contains("payment")
//                || lowerQuery.contains("transaction") || lowerQuery.contains("loan") || lowerQuery.contains("borrow")) {
//            return QueryType.FINANCE;
//        }
//
//        // Default to finance if unclear
//        return QueryType.FINANCE;
//    }
//
//    private boolean isCreateOperation(String query) {
//        String lowerQuery = query.toLowerCase();
//        return lowerQuery.contains("add") || lowerQuery.contains("create") || lowerQuery.contains("save")
//                || lowerQuery.contains("record") || lowerQuery.contains("new");
//    }
//
//    private ChatbotResponse handleCreateOperation(String query, User user, QueryType queryType) {
//        try {
//            if (queryType == QueryType.FINANCE) {
//                return handleFinanceCreation(query, user);
//            } else if (queryType == QueryType.TASK) {
//                return handleTaskCreation(query, user);
//            }
//
//            return new ChatbotResponse("I'm not sure what you want to create. Please specify if it's a finance record or a task.", false);
//
//        } catch (Exception e) {
//            log.error("Error handling create operation: ", e);
//            return new ChatbotResponse("I couldn't create the record. Please provide more specific details.", false);
//        }
//    }
//
//    private ChatbotResponse handleFinanceCreation(String query, User user) {
//        try {
//            // Extract finance details from query using patterns
//            FinanceDetails details = extractFinanceDetails(query);
//
//            if (details.amount == null) {
//                return new ChatbotResponse("Please specify the amount for the finance record.", false);
//            }
//
//            Finance finance = new Finance();
//            finance.setUser(user);
//            finance.setAmount(details.amount);
//            finance.setDescription(details.description != null ? details.description : "Added via chatbot");
//            finance.setCategory(details.category != null ? details.category : "General");
//            finance.setTransactionType(details.transactionType != null ? details.transactionType : Finance.TransactionType.EXPENSE);
//            finance.setTransactionDate(details.date != null ? details.date : LocalDate.now());
//            finance.setPaymentMethod(details.paymentMethod);
//            finance.setCounterparty(details.counterparty);
//
//            Finance savedFinance = financeService.save(finance);
//
//            return new ChatbotResponse(
//                    String.format("✅ Finance record created successfully!\n" +
//                                    "Amount: ₹%.2f\n" +
//                                    "Type: %s\n" +
//                                    "Category: %s\n" +
//                                    "Date: %s\n" +
//                                    "Description: %s",
//                            savedFinance.getAmount(),
//                            savedFinance.getTransactionType(),
//                            savedFinance.getCategory(),
//                            savedFinance.getTransactionDate(),
//                            savedFinance.getDescription()),
//                    true
//            );
//
//        } catch (Exception e) {
//            log.error("Error creating finance record: ", e);
//            return new ChatbotResponse("I couldn't create the finance record. Please check the details and try again.", false);
//        }
//    }
//
//    private ChatbotResponse handleTaskCreation(String query, User user) {
//        try {
//            TaskDetails details = extractTaskDetails(query);
//
//            if (details.title == null || details.title.trim().isEmpty()) {
//                return new ChatbotResponse("Please specify a title for the task.", false);
//            }
//
//            Task task = new Task();
//            task.setUser(user);
//            task.setTitle(details.title);
//            task.setDescription(details.description != null ? details.description : "Added via chatbot");
//            task.setPriority(details.priority != null ? details.priority : "medium");
//            task.setType(details.type != null ? details.type : "personal");
//            task.setDueDate(details.dueDate);
//            task.setEmailReminder(details.emailReminder);
//
//            Task savedTask = taskService.save(task);
//
//            return new ChatbotResponse(
//                    String.format("✅ Task created successfully!\n" +
//                                    "Title: %s\n" +
//                                    "Priority: %s\n" +
//                                    "Type: %s\n" +
//                                    "Due Date: %s\n" +
//                                    "Description: %s",
//                            savedTask.getTitle(),
//                            savedTask.getPriority(),
//                            savedTask.getType(),
//                            savedTask.getDueDate() != null ? savedTask.getDueDate().toString() : "Not set",
//                            savedTask.getDescription()),
//                    true
//            );
//
//        } catch (Exception e) {
//            log.error("Error creating task: ", e);
//            return new ChatbotResponse("I couldn't create the task. Please check the details and try again.", false);
//        }
//    }
//
//    private String buildContextualPrompt(String userQuery, User user, QueryType queryType) {
//        StringBuilder prompt = new StringBuilder();
//        prompt.append("User query: ").append(userQuery);
//        prompt.append("\nUser ID: ").append(user.getId());
//        prompt.append("\nContext: This is a ").append(queryType.name().toLowerCase()).append(" related query for user data.");
//        prompt.append("\nGenerate a SQL query that filters data by user_id = ").append(user.getId());
//
//        if (queryType == QueryType.FINANCE) {
//            prompt.append("\nFor finance queries, consider transaction types: INCOME, EXPENSE, LOAN, BORROW");
//            prompt.append("\nAvailable categories include various expense/income categories");
//        } else if (queryType == QueryType.TASK) {
//            prompt.append("\nFor task queries, consider priority levels: high, medium, low");
//            prompt.append("\nTask types: official, family, personal");
//            prompt.append("\nTask completion status: completed (true/false)");
//        }
//
//        return prompt.toString();
//    }
//
//    private List<String> getRelevantTableNames(QueryType queryType) {
//        if (queryType == QueryType.FINANCE) {
//            return Arrays.asList("finance", "users");
//        } else if (queryType == QueryType.TASK) {
//            return Arrays.asList("task", "users");
//        }
//        return Arrays.asList("finance", "task", "users");
//    }
//
//    @SuppressWarnings("unchecked")
//    private ChatbotResponse executeQueryAndFormatResponse(String sql, String originalQuery, QueryType queryType, User user) {
//        try {
//            List<Map<String, Object>> results;
//
//            if (queryType == QueryType.FINANCE) {
//                results = financeService.executeCustomQuery(sql);
//            } else if (queryType == QueryType.TASK) {
//                results = taskService.executeCustomQuery(sql);
//            } else {
//                return new ChatbotResponse("I couldn't determine what type of data you're looking for.", false);
//            }
//
//            if (results == null || results.isEmpty()) {
//                return new ChatbotResponse("I didn't find any data matching your query. Try asking about different time periods or categories.", false);
//            }
//
//            String formattedResponse = formatQueryResults(results, queryType, originalQuery);
//            return new ChatbotResponse(formattedResponse, true);
//
//        } catch (DataAccessException e) {
//            log.error("Database error executing query: ", e);
//            return new ChatbotResponse("I encountered a database error. Please try a simpler query.", false);
//        } catch (Exception e) {
//            log.error("Error executing query: ", e);
//            return new ChatbotResponse("I couldn't execute your query. Please try rephrasing your request.", false);
//        }
//    }
//
//    private String formatQueryResults(List<Map<String, Object>> results, QueryType queryType, String originalQuery) {
//        StringBuilder response = new StringBuilder();
//
//        if (queryType == QueryType.FINANCE) {
//            response.append(formatFinanceResults(results, originalQuery));
//        } else if (queryType == QueryType.TASK) {
//            response.append(formatTaskResults(results, originalQuery));
//        }
//
//        return response.toString();
//    }
//
//    private String formatFinanceResults(List<Map<String, Object>> results, String originalQuery) {
//        StringBuilder sb = new StringBuilder();
//
//        // Check if it's a summary query (contains aggregation)
//        boolean isSummary = results.get(0).containsKey("total") || results.get(0).containsKey("sum") ||
//                results.get(0).containsKey("count") || results.get(0).containsKey("avg");
//
//        if (isSummary) {
//            sb.append("📊 Financial Summary:\n\n");
//            for (Map<String, Object> row : results) {
//                for (Map.Entry<String, Object> entry : row.entrySet()) {
//                    String key = entry.getKey();
//                    Object value = entry.getValue();
//
//                    if (value instanceof BigDecimal) {
//                        sb.append(String.format("%s: ₹%.2f\n", formatColumnName(key), value));
//                    } else {
//                        sb.append(String.format("%s: %s\n", formatColumnName(key), value));
//                    }
//                }
//                sb.append("\n");
//            }
//        } else {
//            sb.append("💰 Finance Records:\n\n");
//            int count = 1;
//            for (Map<String, Object> row : results) {
//                sb.append(String.format("%d. ", count++));
//
//                Object amount = row.get("amount");
//                Object description = row.get("description");
//                Object category = row.get("category");
//                Object transactionType = row.get("transaction_type") != null ?
//                        row.get("transaction_type") : row.get("transactiontype");
//                Object date = row.get("transaction_date") != null ?
//                        row.get("transaction_date") : row.get("transactiondate");
//
//                if (amount != null) {
//                    sb.append(String.format("₹%.2f", amount));
//                }
//                if (transactionType != null) {
//                    sb.append(String.format(" (%s)", transactionType));
//                }
//                if (category != null) {
//                    sb.append(String.format(" - %s", category));
//                }
//                if (description != null) {
//                    sb.append(String.format(" - %s", description));
//                }
//                if (date != null) {
//                    sb.append(String.format(" [%s]", date));
//                }
//                sb.append("\n");
//
//                if (count > 10) { // Limit to 10 records
//                    sb.append("... and more records\n");
//                    break;
//                }
//            }
//        }
//
//        return sb.toString();
//    }
//
//    private String formatTaskResults(List<Map<String, Object>> results, String originalQuery) {
//        StringBuilder sb = new StringBuilder();
//
//        sb.append("📝 Task Information:\n\n");
//        int count = 1;
//
//        for (Map<String, Object> row : results) {
//            sb.append(String.format("%d. ", count++));
//
//            Object title = row.get("title");
//            Object priority = row.get("priority");
//            Object type = row.get("type");
//            Object completed = row.get("completed");
//            Object dueDate = row.get("due_date") != null ? row.get("due_date") : row.get("duedate");
//            Object description = row.get("description");
//
//            if (title != null) {
//                sb.append(String.format("%s", title));
//            }
//            if (priority != null) {
//                sb.append(String.format(" [%s priority]", priority));
//            }
//            if (type != null) {
//                sb.append(String.format(" (%s)", type));
//            }
//            if (completed != null) {
//                boolean isCompleted = Boolean.parseBoolean(completed.toString());
//                sb.append(isCompleted ? " ✅" : " ⏳");
//            }
//            if (dueDate != null) {
//                sb.append(String.format(" - Due: %s", dueDate));
//            }
//            if (description != null && !description.toString().equals("Added via chatbot")) {
//                sb.append(String.format("\n   Description: %s", description));
//            }
//            sb.append("\n");
//
//            if (count > 10) { // Limit to 10 records
//                sb.append("... and more tasks\n");
//                break;
//            }
//        }
//
//        return sb.toString();
//    }
//
//    private String formatColumnName(String columnName) {
//        return Arrays.stream(columnName.split("_"))
//                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
//                .reduce((a, b) -> a + " " + b)
//                .orElse(columnName);
//    }
//
//    // Helper methods for parsing create operations
//    private FinanceDetails extractFinanceDetails(String query) {
//        FinanceDetails details = new FinanceDetails();
//
//        // Extract amount
//        Pattern amountPattern = Pattern.compile("(₹|rs\\.?|rupees?)\\s*(\\d+(?:\\.\\d{2})?)|\\b(\\d+(?:\\.\\d{2})?)\\s*(?:₹|rs\\.?|rupees?)", Pattern.CASE_INSENSITIVE);
//        Matcher amountMatcher = amountPattern.matcher(query);
//        if (amountMatcher.find()) {
//            String amountStr = amountMatcher.group(2) != null ? amountMatcher.group(2) : amountMatcher.group(3);
//            details.amount = new BigDecimal(amountStr);
//        }
//
//        // Extract transaction type
//        String lowerQuery = query.toLowerCase();
//        if (lowerQuery.contains("income") || lowerQuery.contains("earn") || lowerQuery.contains("salary") || lowerQuery.contains("receive")) {
//            details.transactionType = Finance.TransactionType.INCOME;
//        } else if (lowerQuery.contains("loan") || lowerQuery.contains("lend")) {
//            details.transactionType = Finance.TransactionType.LOAN;
//        } else if (lowerQuery.contains("borrow")) {
//            details.transactionType = Finance.TransactionType.BORROW;
//        } else {
//            details.transactionType = Finance.TransactionType.EXPENSE;
//        }
//
//        // Extract category
//        if (lowerQuery.contains("food") || lowerQuery.contains("restaurant") || lowerQuery.contains("grocery")) {
//            details.category = "Food";
//        } else if (lowerQuery.contains("transport") || lowerQuery.contains("travel") || lowerQuery.contains("fuel")) {
//            details.category = "Transportation";
//        } else if (lowerQuery.contains("entertainment") || lowerQuery.contains("movie") || lowerQuery.contains("game")) {
//            details.category = "Entertainment";
//        } else if (lowerQuery.contains("utility") || lowerQuery.contains("electricity") || lowerQuery.contains("water")) {
//            details.category = "Utilities";
//        }
//
//        // Extract description (simple approach - take text after common keywords)
//        String[] descKeywords = {"for", "on", "description", "note"};
//        for (String keyword : descKeywords) {
//            int index = lowerQuery.indexOf(keyword);
//            if (index != -1 && index < lowerQuery.length() - keyword.length() - 1) {
//                String possibleDesc = query.substring(index + keyword.length()).trim();
//                if (possibleDesc.length() > 2 && possibleDesc.length() < 100) {
//                    details.description = possibleDesc;
//                    break;
//                }
//            }
//        }
//
//        return details;
//    }
//
//    private TaskDetails extractTaskDetails(String query) {
//        TaskDetails details = new TaskDetails();
//
//        // Extract title - look for text after "add task", "create task", etc.
//        String lowerQuery = query.toLowerCase();
//        String[] titleKeywords = {"add task", "create task", "new task", "task", "add", "create"};
//
//        for (String keyword : titleKeywords) {
//            int index = lowerQuery.indexOf(keyword);
//            if (index != -1) {
//                String afterKeyword = query.substring(index + keyword.length()).trim();
//                if (afterKeyword.length() > 0) {
//                    // Take first meaningful part as title
//                    String[] words = afterKeyword.split("\\s+");
//                    if (words.length > 0) {
//                        details.title = String.join(" ", Arrays.copyOfRange(words, 0, Math.min(5, words.length)));
//                    }
//                    break;
//                }
//            }
//        }
//
//        // Extract priority
//        if (lowerQuery.contains("high priority") || lowerQuery.contains("urgent") || lowerQuery.contains("important")) {
//            details.priority = "high";
//        } else if (lowerQuery.contains("low priority") || lowerQuery.contains("later")) {
//            details.priority = "low";
//        } else {
//            details.priority = "medium";
//        }
//
//        // Extract type
//        if (lowerQuery.contains("work") || lowerQuery.contains("office") || lowerQuery.contains("official")) {
//            details.type = "official";
//        } else if (lowerQuery.contains("family") || lowerQuery.contains("home")) {
//            details.type = "family";
//        } else {
//            details.type = "personal";
//        }
//
//        // Extract due date (simple patterns)
//        Pattern datePattern = Pattern.compile("\\b(\\d{1,2})[-/](\\d{1,2})[-/](\\d{4})\\b");
//        Matcher dateMatcher = datePattern.matcher(query);
//        if (dateMatcher.find()) {
//            try {
//                int day = Integer.parseInt(dateMatcher.group(1));
//                int month = Integer.parseInt(dateMatcher.group(2));
//                int year = Integer.parseInt(dateMatcher.group(3));
//                details.dueDate = LocalDate.of(year, month, day);
//            } catch (Exception e) {
//                log.warn("Failed to parse date from query: {}", query);
//            }
//        }
//
//        return details;
//    }
//
//    public Map<String, Object> getHealthStatus() {
//        Map<String, Object> health = new HashMap<>();
//        health.put("status", "healthy");
//        health.put("sqlGeneratorAvailable", sqlGeneratorClient.isHealthy());
//        health.put("timestamp", LocalDate.now());
//        return health;
//    }
//
//    // Helper classes
//    private static class FinanceDetails {
//        BigDecimal amount;
//        String description;
//        String category;
//        Finance.TransactionType transactionType;
//        LocalDate date;
//        String paymentMethod;
//        String counterparty;
//    }
//
//    private static class TaskDetails {
//        String title;
//        String description;
//        String priority;
//        String type;
//        LocalDate dueDate;
//        boolean emailReminder = false;
//    }
//
//    public enum QueryType {
//        FINANCE, TASK, GENERAL
//    }
//}
