package com.arthManager.finance.controller;

import com.arthManager.finance.dto.AddFinance;
import com.arthManager.finance.dto.FinanceDto;
import com.arthManager.finance.service.FinanceService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
@AllArgsConstructor
public class FinanceController {
    @Autowired
    private FinanceService financeService;
    // private final FinanceService financeService;

    // @Autowired
    // public FinanceController(FinanceService financeService) {
    // this.financeService = financeService;
    // }

    // Get paginatated finance records (Transactions) for the authenticated user
    @GetMapping("/transactions")
    public Page<FinanceDto> getTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            Pageable pageable,
            @AuthenticationPrincipal(expression = "username") String username) {
        return financeService.getTransactions(username, type, category, startDate, endDate, pageable);
    }

    // Get a single transaction by ID
    @GetMapping("/transactions/{id}")
    public ResponseEntity<FinanceDto> getTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "username") String username) {
        FinanceDto financeDto = financeService.getTransactionById(username, id);
        return ResponseEntity.ok(financeDto);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createFinanceRecord(
            @Valid @RequestBody AddFinance addFinance,
            @AuthenticationPrincipal(expression = "username") String username) {
        financeService.createFinanceRecord(addFinance, username);
        return ResponseEntity.ok("Finance record created successfully");
    }

    // Add more endpoints as needed for retrieving, updating, and deleting finance
    // records

}
