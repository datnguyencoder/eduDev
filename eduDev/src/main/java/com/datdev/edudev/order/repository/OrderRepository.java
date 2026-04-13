package com.datdev.edudev.order.repository;

import com.datdev.edudev.order.entity.Order;
import com.datdev.edudev.order.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCode(String orderCode);

    List<Order> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    boolean existsByOrderCode(String orderCode);

    List<Order> findByStudentIdAndStatus(Long studentId, OrderStatus status);
}
