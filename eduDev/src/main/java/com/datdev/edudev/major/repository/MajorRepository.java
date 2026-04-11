package com.datdev.edudev.major.repository;

import com.datdev.edudev.major.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MajorRepository extends JpaRepository<Major, Long> {
    List<Major> findByGroupName(String groupName);
    List<Major> findByNameContainingIgnoreCase(String name);
}
