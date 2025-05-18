package com.arthManager.finance.repository;

import com.arthManager.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.arthManager.finance.model.Finance;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinanceRepository extends JpaRepository<Finance, Long> {


    List<Finance> findByUser(User user);

    Finance findByUserAndId(User user, Long financeId);

    List<Finance> findByUserAndTransactionDate(User user, LocalDate date);

    List<Finance> findByUserAndCategory(User user, String category);

    List<Finance> findByUserAndTransactionType(User user, Finance.TransactionType type);

    List<Finance> findByUserAndLoanStatus(User user, Finance.LoanStatus status);

}
