package com.datdev.edudev.lesson.repository;

import com.datdev.edudev.common.entity.ContentStatus;
import com.datdev.edudev.lesson.entity.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByTopicIdAndStatusOrderByDisplayOrderAsc(Long topicId, ContentStatus status);

    List<Lesson> findByStatus(ContentStatus status);

    Page<Lesson> findByCreatorId(Long creatorId, Pageable pageable);

    List<Lesson> findByTopicIdOrderByDisplayOrderAsc(Long topicId);
}
