package com.datdev.edudev.quiz.repository;

import com.datdev.edudev.quiz.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdAndQuizIdOrderByCreatedAtDesc(Long userId, Long quizId);
    List<QuizAttempt> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<QuizAttempt> findByIdAndUserId(Long id, Long userId);
}
