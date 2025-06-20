package com.arthManager.chatbot.service;

import com.arthManager.chatbot.service.ChatbotService.QueryType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Slf4j
public class QueryValidator {

    // Dangerous SQL keywords that should be blocked
    private static final List<String> DANGEROUS_KEYWORDS = Arrays.asList(
            "DROP", "DELETE", "TRUNCATE", "ALTER", "CREATE", "INSERT", "UPDATE",
            "EXEC", "EXECUTE", "UNION", "SCRIPT", "DECLARE", "CURSOR", "PROCEDURE",
            "FUNCTION", "TRIGGER", "INDEX", "VIEW", "GRANT", "REVOKE", "COMMIT",
            "ROLLBACK", "SAVEPOINT", "LOCK", "UNLOCK"
    );

    // Allowed SQL keywords for read operations
    private static final List<String> ALLOWED_KEYWORDS = Arrays.asList(
            "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER",
            "GROUP", "ORDER", "BY", "HAVING", "LIMIT", "OFFSET", "COUNT", "SUM",
            "AVG", "MAX", "MIN", "AS", "AND", "OR", "NOT", "IN", "LIKE", "BETWEEN",
            "IS", "NULL", "DISTINCT", "ASC", "DESC", "CASE", "WHEN", "THEN", "ELSE",
            "END", "CAST", "EXTRACT", "DATE", "YEAR", "MONTH", "DAY"
    );

    // SQL injection patterns
    private static final List<Pattern> INJECTION_PATTERNS = Arrays.asList(
            Pattern.compile("(;\\s*--)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(;\\s*/\\*)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("('\\s*;)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\bunion\\s+select)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\bor\\s+1\\s*=\\s*1)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\band\\s+1\\s*=\\s*1)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\bor\\s+'\\w+'\\s*=\\s*'\\w+')", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\$\\w+\\s*=)", Pattern.CASE_INSENSITIVE)
    );

    public String validateAndSanitizeSQL(String sql, QueryType queryType, Long userId) {
        if (sql == null || sql.trim().isEmpty()) {
            log.warn("Empty SQL query provided");
            return null;
        }

        String cleanSQL = sql.trim();
        log.info("Validating SQL query: {}", cleanSQL);

        // Check for dangerous keywords
        if (containsDangerousKeywords(cleanSQL)) {
            log.warn("SQL query contains dangerous keywords: {}", cleanSQL);
            return null;
        }

        // Check for SQL injection patterns
        if (containsInjectionPatterns(cleanSQL)) {
            log.warn("SQL query contains potential injection patterns: {}", cleanSQL);
            return null;
        }

        // Ensure it's a SELECT query
        if (!cleanSQL.toUpperCase().trim().startsWith("SELECT")) {
            log.warn("Non-SELECT query attempted: {}", cleanSQL);
            return null;
        }

        // Ensure user_id filtering is present
        if (!containsUserIdFilter(cleanSQL, userId)) {
            cleanSQL = addUserIdFilter(cleanSQL, queryType, userId);
        }

        // Validate table access based on query type
        if (!validateTableAccess(cleanSQL, queryType)) {
            log.warn("Invalid table access for query type {}: {}", queryType, cleanSQL);
            return null;
        }

        // Add safety limits
        cleanSQL = addSafetyLimits(cleanSQL);

        log.info("SQL query validated and sanitized successfully");
        return cleanSQL;
    }

    private boolean containsDangerousKeywords(String sql) {
        String upperSQL = sql.toUpperCase();
        return DANGEROUS_KEYWORDS.stream()
                .anyMatch(keyword -> upperSQL.contains(keyword));
    }

    private boolean containsInjectionPatterns(String sql) {
        return INJECTION_PATTERNS.stream()
                .anyMatch(pattern -> pattern.matcher(sql).find());
    }

    private boolean containsUserIdFilter(String sql, Long userId) {
        String upperSQL = sql.toUpperCase();
        String userIdPattern1 = "USER_ID = " + userId;
        String userIdPattern2 = "USER_ID=" + userId;
        String userIdPattern3 = "u.ID = " + userId;
        String userIdPattern4 = "u.ID=" + userId;

        return upperSQL.contains(userIdPattern1.toUpperCase()) ||
                upperSQL.contains(userIdPattern2.toUpperCase()) ||
                upperSQL.contains(userIdPattern3.toUpperCase()) ||
                upperSQL.contains(userIdPattern4.toUpperCase());
    }

    private String addUserIdFilter(String sql, QueryType queryType, Long userId) {
        String upperSQL = sql.toUpperCase();

        // Determine the main table alias or name
        String tableReference = getTableReference(sql, queryType);

        if (upperSQL.contains("WHERE")) {
            // Add to existing WHERE clause
            sql = sql.replaceFirst("(?i)WHERE", "WHERE " + tableReference + ".user_id = " + userId + " AND");
        } else if (upperSQL.contains("GROUP BY")) {
            // Add WHERE before GROUP BY
            sql = sql.replaceFirst("(?i)GROUP BY", "WHERE " + tableReference + ".user_id = " + userId + " GROUP BY");
        } else if (upperSQL.contains("ORDER BY")) {
            // Add WHERE before ORDER BY
            sql = sql.replaceFirst("(?i)ORDER BY", "WHERE " + tableReference + ".user_id = " + userId + " ORDER BY");
        } else if (upperSQL.contains("LIMIT")) {
            // Add WHERE before LIMIT
            sql = sql.replaceFirst("(?i)LIMIT", "WHERE " + tableReference + ".user_id = " + userId + " LIMIT");
        } else {
            // Add WHERE at the end
            if (sql.endsWith(";")) {
                sql = sql.substring(0, sql.length() - 1) + " WHERE " + tableReference + ".user_id = " + userId + ";";
            } else {
                sql += " WHERE " + tableReference + ".user_id = " + userId;
            }
        }

        return sql;
    }

    private String getTableReference(String sql, QueryType queryType) {
        String upperSQL = sql.toUpperCase();

        // Check for table aliases
        if (queryType == QueryType.FINANCE) {
            if (upperSQL.contains("FINANCE F") || upperSQL.contains("FINANCE AS F")) {
                return "f";
            }
            return "finance";
        } else if (queryType == QueryType.TASK) {
            if (upperSQL.contains("TASK T") || upperSQL.contains("TASK AS T")) {
                return "t";
            }
            return "task";
        }

        return "finance"; // default
    }

    private boolean validateTableAccess(String sql, QueryType queryType) {
        String upperSQL = sql.toUpperCase();

        if (queryType == QueryType.FINANCE) {
            // Should access finance table, optionally users table
            boolean hasFinanceTable = upperSQL.contains("FINANCE") || upperSQL.contains("FROM F ");
            boolean hasInvalidTable = upperSQL.contains("TASK") && !upperSQL.contains("FINANCE");
            return hasFinanceTable && !hasInvalidTable;
        } else if (queryType == QueryType.TASK) {
            // Should access task table, optionally users table
            boolean hasTaskTable = upperSQL.contains("TASK") || upperSQL.contains("FROM T ");
            boolean hasInvalidTable = upperSQL.contains("FINANCE") && !upperSQL.contains("TASK");
            return hasTaskTable && !hasInvalidTable;
        }

        return true; // For general queries, allow both tables
    }



    private String addSafetyLimits(String sql) {
        String upperSQL = sql.toUpperCase();

        // Add LIMIT if not present
        if (!upperSQL.contains("LIMIT")) {
            if (sql.endsWith(";")) {
                sql = sql.substring(0, sql.length() - 1) + " LIMIT 100;";
            } else {
                sql += " LIMIT 100";
            }
        } else {
            // Use Pattern and Matcher correctly
            Pattern pattern = Pattern.compile("(?i)LIMIT\\s+(\\d+)");
            Matcher matcher = pattern.matcher(sql);
            sql = matcher.replaceAll(matchResult -> {
                String limitStr = matchResult.group(1);
                try {
                    int limit = Integer.parseInt(limitStr);
                    if (limit > 1000) {
                        return "LIMIT 1000";
                    }
                } catch (NumberFormatException e) {
                    return "LIMIT 100";
                }
                return matchResult.group(0);
            });
        }

        return sql;
    }


//    private String addSafetyLimits(String sql) {
//        String upperSQL = sql.toUpperCase();
//
//        // Add LIMIT if not present
//        if (!upperSQL.contains("LIMIT")) {
//            if (sql.endsWith(";")) {
//                sql = sql.substring(0, sql.length() - 1) + " LIMIT 100;";
//            } else {
//                sql += " LIMIT 100";
//            }
//        } else {
//            // Ensure LIMIT is not too high
//            sql = sql.replaceAll("(?i)LIMIT\\s+(\\d+)", (match) -> {
//                String limitStr = match.group(1);
//                try {
//                    int limit = Integer.parseInt(limitStr);
//                    if (limit > 1000) {
//                        return "LIMIT 1000";
//                    }
//                } catch (NumberFormatException e) {
//                    return "LIMIT 100";
//                }
//                return match.group(0);
//            });
//        }
//
//        return sql;
//    }

    public boolean isValidReadOnlyQuery(String sql) {
        if (sql == null || sql.trim().isEmpty()) {
            return false;
        }

        String upperSQL = sql.toUpperCase().trim();

        // Must start with SELECT
        if (!upperSQL.startsWith("SELECT")) {
            return false;
        }

        // Must not contain dangerous keywords
        if (containsDangerousKeywords(sql)) {
            return false;
        }

        // Must not contain injection patterns
        if (containsInjectionPatterns(sql)) {
            return false;
        }

        return true;
    }
}

