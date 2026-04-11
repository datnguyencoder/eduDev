package com.datdev.edudev.subject.repository;

import com.datdev.edudev.subject.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findAllByOrderByDisplayOrderAsc();

    boolean existsByName(String name);
}
