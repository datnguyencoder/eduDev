package com.datdev.edudev.combo.repository;

import com.datdev.edudev.combo.entity.Combo;
import com.datdev.edudev.common.entity.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Long> {
    List<Combo> findByStatus(ContentStatus status);
}
