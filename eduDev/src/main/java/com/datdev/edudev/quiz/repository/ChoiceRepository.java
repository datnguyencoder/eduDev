package com.datdev.edudev.quiz.repository;

import com.datdev.edudev.quiz.entity.Choice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Long> {
    List<Choice> findByQuestionIdOrderByDisplayOrderAsc(Long questionId);
}
