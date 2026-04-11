package com.datdev.edudev.quiz.repository;

import com.datdev.edudev.common.entity.ContentStatus;
import com.datdev.edudev.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByLessonIdAndStatus(Long lessonId, ContentStatus status);
    Optional<Quiz> findByIdAndStatus(Long id, ContentStatus status);
}
