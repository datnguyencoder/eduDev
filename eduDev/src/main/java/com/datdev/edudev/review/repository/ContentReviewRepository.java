package com.datdev.edudev.review.repository;

import com.datdev.edudev.review.entity.ContentReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentReviewRepository extends JpaRepository<ContentReview, Long> {
    List<ContentReview> findByLessonIdOrderByCreatedAtDesc(Long lessonId);
    List<ContentReview> findByQuizIdOrderByCreatedAtDesc(Long quizId);
}
