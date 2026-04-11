package com.datdev.edudev.quiz.repository;

import com.datdev.edudev.quiz.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuizIdOrderByDisplayOrderAsc(Long quizId);
}
