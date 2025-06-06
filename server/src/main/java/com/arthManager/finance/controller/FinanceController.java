package com.arthManager.finance.controller;

import com.arthManager.finance.dto.AddFinance;
import com.arthManager.finance.service.FinanceService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/finance")
@AllArgsConstructor
public class FinanceController {
    @Autowired
    private  FinanceService financeService;
//    private final FinanceService financeService;

//    @Autowired
//    public FinanceController(FinanceService financeService) {
//        this.financeService = financeService;
//    }


    @PostMapping("/create")
    public ResponseEntity<?> createFinanceRecord(@RequestBody AddFinance addFinance) {
        try{
            financeService.createFinanceRecord(addFinance);
            return ResponseEntity.ok("Finance record created successfully");
        }
        catch(Exception e){
            return ResponseEntity.status(500).body("Error creating finance record: " + e.getMessage());
        }
    }



    // Add more endpoints as needed for retrieving, updating, and deleting finance records

}
