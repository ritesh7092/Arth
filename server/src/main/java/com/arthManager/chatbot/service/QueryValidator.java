package com.arthManager.chatbot.service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
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

