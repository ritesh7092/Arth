package com.arthManager.controller;

import com.arthManager.model.Finance;
import com.arthManager.service.FinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Controller
public class FinanceController {

    @Autowired
    private FinanceService financeService;

    // Display the finance dashboard
    @GetMapping("/finance/dashboard")
    public String financeDashboard(Model model) {
        // Fetch today's finance transactions for the current user
        List<Finance> todayFinances = financeService.getFinancesForDate(LocalDate.now());
        model.addAttribute("todayFinances", todayFinances);

        // Fetch all finance transactions for the current user and sort by transaction date
        List<Finance> allFinances = financeService.getAllFinancesForUser();
        sortFinancesByTransactionDate(allFinances);
        model.addAttribute("allFinances", allFinances);

        model.addAttribute("balance", financeService.getUserBalance());

        // Set server time to be displayed on the dashboard
        LocalDateTime now = LocalDateTime.now();
        String formattedDate = DateTimeFormatter.ofPattern("MM/dd/yyyy").format(now);
        model.addAttribute("serverTime", formattedDate);

        // Add additional summaries (e.g., income vs. expense)
        model.addAttribute("incomeVsExpense", financeService.getIncomeVsExpenseSummary());

        return "finance_dashboard";
    }

    // Utility method to sort finance transactions by transaction date
    private void sortFinancesByTransactionDate(List<Finance> finances) {
        Collections.sort(finances, new Comparator<Finance>() {
            @Override
            public int compare(Finance f1, Finance f2) {
                if (f1.getTransactionDate() == null && f2.getTransactionDate() == null) {
                    return 0;
                }
                if (f1.getTransactionDate() == null) {
                    return 1;
                }
                if (f2.getTransactionDate() == null) {
                    return -1;
                }
                return f2.getTransactionDate().compareTo(f1.getTransactionDate());
            }
        });
    }

    // Display the form to add a new finance record
    @GetMapping("/finance/add")
    public String addFinanceForm(Model model) {
        model.addAttribute("finance", new Finance());
        return "add_finance";
    }

    // Save a new finance record
    @PostMapping("/finance/add")
    public String saveFinance(@ModelAttribute("finance") Finance finance, RedirectAttributes redirectAttributes) {
        try {
            financeService.saveFinance(finance);
            redirectAttributes.addFlashAttribute("successMessage", "Finance record added successfully!");
            return "redirect:/finance/dashboard";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to add finance record. Please try again.");
            return "redirect:/finance/add";
        }
    }

    // View a single finance record
    @GetMapping("/finance/view")
    public String viewFinance(@RequestParam("financeId") Long financeId, Model model, RedirectAttributes redirectAttributes) {
        Finance finance = financeService.findFinanceById(financeId);
        if (finance != null) {
            model.addAttribute("finance", finance);
            return "view_finance";
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Finance record not found.");
            return "redirect:/finance/dashboard";
        }
    }

    // Display the form to edit an existing finance record
    @GetMapping("/finance/edit")
    public String editFinanceForm(@RequestParam("financeId") Long financeId, Model model, RedirectAttributes redirectAttributes) {
        Finance finance = financeService.findFinanceById(financeId);
        if (finance != null) {
            model.addAttribute("finance", finance);
            return "edit_finance";
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Finance record not found.");
            return "redirect:/finance/dashboard";
        }
    }

    // Update an existing finance record
    @PostMapping("/finance/update")
    public String updateFinance(@ModelAttribute("finance") Finance finance, RedirectAttributes redirectAttributes) {
        try {
            boolean updated = financeService.updateFinance(finance);
            if (updated) {
                redirectAttributes.addFlashAttribute("successMessage", "Finance record updated successfully!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Failed to update finance record.");
            }
            return "redirect:/finance/dashboard";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error updating finance record.");
            return "redirect:/finance/edit?financeId=" + finance.getId();
        }
    }

    // Delete a finance record
    @PostMapping("/finance/delete")
    public String deleteFinance(@RequestParam("financeId") Long financeId, RedirectAttributes redirectAttributes) {
        boolean deleted = financeService.deleteFinance(financeId);
        if (deleted) {
            redirectAttributes.addFlashAttribute("successMessage", "Finance record deleted successfully.");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to delete finance record.");
        }
        return "redirect:/finance/dashboard";
    }

    // Mark a loan/borrow transaction as completed
    @PostMapping("/finance/markCompleted")
    public String markLoanAsCompleted(@RequestParam("financeId") Long financeId, RedirectAttributes redirectAttributes) {
        boolean marked = financeService.markLoanAsCompleted(financeId);
        if (marked) {
            redirectAttributes.addFlashAttribute("successMessage", "Loan/Borrow marked as completed.");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to update loan/borrow status.");
        }
        return "redirect:/finance/dashboard";
    }
}


