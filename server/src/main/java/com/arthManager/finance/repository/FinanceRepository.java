package com.arthManager.finance.repository;

import com.arthManager.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.arthManager.finance.model.Finance;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinanceRepository extends JpaRepository<Finance, Long> {
    @Query("SELECT f FROM Finance f WHERE f.user = :user"
            + " AND (:transactionType IS NULL OR f.transactionType = :transactionType)"
            + " AND (:category IS NULL OR f.category = :category)"
            + " AND (:start IS NULL OR f.transactionDate >= :start)"
            + " AND (:end IS NULL OR f.transactionDate <= :end)" +
            " ORDER BY f.transactionDate DESC")
    Page<Finance> findByUserAndFilters(
            @Param("user") User user,
            @Param("transactionType") String transactionType,
            @Param("category") String category,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            Pageable pageable
    );


//    List<Finance> findByUser(User user);
//
//    Finance findByUserAndId(User user, Long financeId);
//
//    List<Finance> findByUserAndTransactionDate(User user, LocalDate date);
//
//    List<Finance> findByUserAndCategory(User user, String category);
//
//    List<Finance> findByUserAndTransactionType(User user, Finance.TransactionType type);

//    List<Finance> findByUserAndDueStatus(User user, Finance.DueStatus status);

}
