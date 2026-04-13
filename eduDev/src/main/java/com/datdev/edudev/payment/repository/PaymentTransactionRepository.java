package com.datdev.edudev.payment.repository;

import com.datdev.edudev.payment.entity.PaymentStatus;
import com.datdev.edudev.payment.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByTxnRef(String txnRef);

    List<PaymentTransaction> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    boolean existsByTxnRef(String txnRef);

    Optional<PaymentTransaction> findFirstByOrderIdAndStatus(Long orderId, PaymentStatus status);

    Optional<PaymentTransaction> findFirstByOrderIdOrderByCreatedAtDesc(Long orderId);
}
