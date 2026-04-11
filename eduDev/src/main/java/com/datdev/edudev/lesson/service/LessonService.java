package com.datdev.edudev.lesson.service;

import com.datdev.edudev.common.entity.ContentStatus;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.lesson.dto.CreateLessonRequest;
import com.datdev.edudev.lesson.dto.LessonResponse;
import com.datdev.edudev.lesson.dto.UpdateLessonRequest;
import com.datdev.edudev.lesson.entity.Bookmark;
import com.datdev.edudev.lesson.entity.Difficulty;
import com.datdev.edudev.lesson.entity.Lesson;
import com.datdev.edudev.lesson.entity.LessonProgress;
import com.datdev.edudev.lesson.mapper.LessonMapper;
import com.datdev.edudev.lesson.repository.BookmarkRepository;
import com.datdev.edudev.lesson.repository.LessonProgressRepository;
import com.datdev.edudev.lesson.repository.LessonRepository;
import com.datdev.edudev.subject.entity.Topic;
import com.datdev.edudev.subject.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final TopicRepository topicRepository;
    private final BookmarkRepository bookmarkRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final LessonMapper lessonMapper;

    public LessonService(
            LessonRepository lessonRepository,
            TopicRepository topicRepository,
            BookmarkRepository bookmarkRepository,
            LessonProgressRepository lessonProgressRepository,
            LessonMapper lessonMapper
    ) {
        this.lessonRepository = lessonRepository;
        this.topicRepository = topicRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonMapper = lessonMapper;
    }
    public List<LessonResponse> getPublishedLessonsByTopic(Long topicId) {
        return lessonRepository.findByTopicIdAndStatusOrderByDisplayOrderAsc(topicId, ContentStatus.PUBLISHED)
                .stream().map(lessonMapper::toResponse).toList();
    }

    public LessonResponse getLessonById(Long id) {
        Lesson lesson = findLessonOrThrow(id);
        return lessonMapper.toResponse(lesson);
    }
    @Transactional
    public LessonResponse createLesson(Long creatorId, CreateLessonRequest request) {
        Topic topic = topicRepository.findById(request.topicId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Topic not found"));

        Difficulty difficulty = Difficulty.MEDIUM;
        if (request.difficulty() != null) {
            try { difficulty = Difficulty.valueOf(request.difficulty().toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        Lesson lesson = Lesson.builder()
                .topic(topic)
                .creatorId(creatorId)
                .title(request.title())
                .content(request.content())
                .summary(request.summary())
                .difficulty(difficulty)
                .estimatedMinutes(request.estimatedMinutes())
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
                .status(ContentStatus.DRAFT)
                .build();

        return lessonMapper.toResponse(lessonRepository.save(lesson));
    }
    @Transactional
    public LessonResponse updateLesson(Long lessonId, Long userId, UpdateLessonRequest request) {
        Lesson lesson = findLessonOrThrow(lessonId);

        // Kiểm tra ownership
        if (!lesson.getCreatorId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_CONTENT_OWNER);
        }

        // Kiểm tra status cho phép sửa
        if (lesson.getStatus() != ContentStatus.DRAFT && lesson.getStatus() != ContentStatus.REJECTED) {
            throw new BusinessException(ErrorCode.INVALID_CONTENT_STATUS,
                    "Can only edit lessons in DRAFT or REJECTED status");
        }

        if (request.title() != null) lesson.setTitle(request.title());
        if (request.content() != null) lesson.setContent(request.content());
        if (request.summary() != null) lesson.setSummary(request.summary());
        if (request.estimatedMinutes() != null) lesson.setEstimatedMinutes(request.estimatedMinutes());
        if (request.displayOrder() != null) lesson.setDisplayOrder(request.displayOrder());
        if (request.difficulty() != null) {
            try { lesson.setDifficulty(Difficulty.valueOf(request.difficulty().toUpperCase())); }
            catch (IllegalArgumentException ignored) {}
        }
        lesson.setUpdatedAt(Instant.now());

        // Nếu lesson đang REJECTED và teacher sửa lại → chuyển về DRAFT
        if (lesson.getStatus() == ContentStatus.REJECTED) {
            lesson.setStatus(ContentStatus.DRAFT);
        }

        return lessonMapper.toResponse(lessonRepository.save(lesson));
    }
    @Transactional
    public LessonResponse submitForReview(Long lessonId, Long userId) {
        Lesson lesson = findLessonOrThrow(lessonId);
        if (!lesson.getCreatorId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_CONTENT_OWNER);
        }
        if (lesson.getStatus() != ContentStatus.DRAFT) {
            throw new BusinessException(ErrorCode.INVALID_CONTENT_STATUS,
                    "Only DRAFT lessons can be submitted for review");
        }
        lesson.setStatus(ContentStatus.PENDING_REVIEW);
        lesson.setUpdatedAt(Instant.now());
        return lessonMapper.toResponse(lessonRepository.save(lesson));
    }
    @Transactional
    public void bookmarkLesson(Long userId, Long lessonId) {
        findLessonOrThrow(lessonId);
        if (!bookmarkRepository.existsByUserIdAndLessonId(userId, lessonId)) {
            bookmarkRepository.save(Bookmark.builder().userId(userId).lessonId(lessonId).build());
        }
    }

    @Transactional
    public void removeBookmark(Long userId, Long lessonId) {
        bookmarkRepository.findByUserIdAndLessonId(userId, lessonId)
                .ifPresent(bookmarkRepository::delete);
    }
    @Transactional
    public void completeLesson(Long userId, Long lessonId) {
        findLessonOrThrow(lessonId);
        if (!lessonProgressRepository.existsByUserIdAndLessonId(userId, lessonId)) {
            lessonProgressRepository.save(
                    LessonProgress.builder().userId(userId).lessonId(lessonId).build()
            );
        }
        // Future: publish LessonCompletedEvent via Kafka
    }

    // === PRIVATE HELPERS ===

    private Lesson findLessonOrThrow(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Lesson not found"));
    }
}
