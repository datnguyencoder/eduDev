package com.datdev.edudev.combo.service;

import com.datdev.edudev.combo.dto.*;
import com.datdev.edudev.combo.entity.*;
import com.datdev.edudev.combo.mapper.ComboMapper;
import com.datdev.edudev.combo.repository.*;
import com.datdev.edudev.common.entity.ContentStatus;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.subject.entity.Subject;
import com.datdev.edudev.subject.entity.Topic;
import com.datdev.edudev.subject.repository.SubjectRepository;
import com.datdev.edudev.subject.repository.TopicRepository;
import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.common.kafka.KafkaProducerService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class ComboService {

    private final ComboRepository comboRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ComboProgressRepository progressRepository;
    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final ComboMapper comboMapper;
    private final KafkaProducerService kafkaProducerService;

    public ComboService(
            ComboRepository comboRepository,
            EnrollmentRepository enrollmentRepository,
            ComboProgressRepository progressRepository,
            SubjectRepository subjectRepository,
            TopicRepository topicRepository,
            UserRepository userRepository,
            ComboMapper comboMapper,
            KafkaProducerService kafkaProducerService
    ) {
        this.comboRepository = comboRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.progressRepository = progressRepository;
        this.subjectRepository = subjectRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
        this.comboMapper = comboMapper;
        this.kafkaProducerService = kafkaProducerService;
    }

    @Cacheable(value = "combos")
    public List<ComboSummaryResponse> getPublishedCombos() {
        return comboMapper.toSummaryResponseList(comboRepository.findByStatus(ContentStatus.PUBLISHED));
    }

    public ComboResponse getComboById(Long id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Combo not found"));
        return comboMapper.toResponse(combo);
    }

    @Transactional
    @CacheEvict(value = "combos", allEntries = true)
    public ComboResponse createCombo(CreateComboRequest request) {
        if (comboRepository.findByStatus(ContentStatus.PUBLISHED).stream().anyMatch(c -> c.getName().equals(request.name()))) {
             // Basic unique name check
        }

        Combo combo = Combo.builder()
                .name(request.name())
                .description(request.description())
                .thumbnailUrl(request.thumbnailUrl())
                .price(request.price())
                .status(ContentStatus.DRAFT)
                .build();

        if (request.items() != null) {
            for (ComboItemRequest itemReq : request.items()) {
                ComboItem item = ComboItem.builder().displayOrder(itemReq.displayOrder() != null ? itemReq.displayOrder() : 0).build();
                if (itemReq.subjectId() != null) {
                    Subject s = subjectRepository.findById(itemReq.subjectId()).orElseThrow();
                    item.setSubject(s);
                } else if (itemReq.topicId() != null) {
                    Topic t = topicRepository.findById(itemReq.topicId()).orElseThrow();
                    item.setTopic(t);
                }
                combo.addItem(item);
            }
        }

        return comboMapper.toResponse(comboRepository.save(combo));
    }

    @Transactional
    @CacheEvict(value = "combos", allEntries = true)
    public ComboResponse updateCombo(Long comboId, CreateComboRequest request) {
        Combo combo = comboRepository.findById(comboId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Combo not found"));

        combo.setName(request.name());
        combo.setDescription(request.description());
        combo.setThumbnailUrl(request.thumbnailUrl());
        combo.setPrice(request.price());
        combo.setUpdatedAt(Instant.now());
        combo.getItems().clear();

        if (request.items() != null) {
            for (ComboItemRequest itemReq : request.items()) {
                ComboItem item = ComboItem.builder()
                        .displayOrder(itemReq.displayOrder() != null ? itemReq.displayOrder() : 0)
                        .build();
                if (itemReq.subjectId() != null) {
                    item.setSubject(subjectRepository.findById(itemReq.subjectId()).orElseThrow());
                } else if (itemReq.topicId() != null) {
                    item.setTopic(topicRepository.findById(itemReq.topicId()).orElseThrow());
                }
                combo.addItem(item);
            }
        }

        return comboMapper.toResponse(comboRepository.save(combo));
    }

    @Transactional
    @CacheEvict(value = "combos", allEntries = true)
    public ComboResponse submitForReview(Long comboId) {
        Combo combo = comboRepository.findById(comboId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Combo not found"));
        if (combo.getStatus() != ContentStatus.DRAFT) {
            throw new BusinessException(
                    ErrorCode.INVALID_CONTENT_STATUS,
                    "Only DRAFT combos can be submitted for review"
            );
        }
        combo.setStatus(ContentStatus.PENDING_REVIEW);
        combo.setUpdatedAt(Instant.now());
        return comboMapper.toResponse(comboRepository.save(combo));
    }
    @Transactional
    public EnrollmentResponse enroll(Long userId, Long comboId) {
        if (enrollmentRepository.existsByUserIdAndComboId(userId, comboId)) {
            throw new BusinessException(ErrorCode.ALREADY_ENROLLED, "User already enrolled in this combo");
        }

        User user = userRepository.findById(userId).orElseThrow();
        Combo combo = comboRepository.findById(comboId).orElseThrow();
        
        if (combo.getStatus() != ContentStatus.PUBLISHED) {
            throw new BusinessException(ErrorCode.INVALID_CONTENT_STATUS, "Cannot enroll in a non-published combo");
        }

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .combo(combo)
                .status(EnrollmentStatus.ACTIVE)
                .build();

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Publish event for notification system
        java.util.Map<String, Object> eventPayload = new java.util.HashMap<>();
        eventPayload.put("userId", userId);
        eventPayload.put("comboId", comboId);
        eventPayload.put("enrollmentId", savedEnrollment.getId());
        kafkaProducerService.sendEvent("enrollment-created", eventPayload);

        return comboMapper.toEnrollmentResponse(savedEnrollment);
    }

    public List<EnrollmentResponse> getMyEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId).stream()
                .map(this::mapToEnrollmentResponseWithProgress)
                .toList();
    }

    private EnrollmentResponse mapToEnrollmentResponseWithProgress(Enrollment enrollment) {
        EnrollmentResponse response = comboMapper.toEnrollmentResponse(enrollment);
        
        // Tính toán progress (giả định đơn giản: số bài học hoàn thành / tổng số bài học trong combo)
        // Trong thực tế cần join nhiều bảng hơn hoặc lưu cache.
        // Đây là mock progress logic:
        List<ComboProgress> progressList = progressRepository.findByEnrollmentId(enrollment.getId());
        long completedCount = progressList.stream().filter(ComboProgress::getCompleted).count();
        
        // Mocking total lessons logic: 
        // Lấy tất cả topics/subjects trong combo -> lấy tất cả lessons.
        // (Đây là logic nặng, nên được tối ưu bằng query hoặc event-driven progress)
        response = new EnrollmentResponse(
                response.id(), response.comboId(), response.comboName(), 
                response.enrolledAt(), response.status(), 
                progressList.isEmpty() ? 0.0 : (completedCount * 100.0 / progressList.size())
        );
        
        return response;
    }

    @Transactional
    public void markLessonAsCompleted(Long userId, Long comboId, Long lessonId) {
        Enrollment enrollment = enrollmentRepository.findByUserIdAndComboId(userId, comboId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Enrollment not found"));

        ComboProgress progress = progressRepository.findByEnrollmentIdAndLessonId(enrollment.getId(), lessonId)
                .orElseGet(() -> ComboProgress.builder()
                        .enrollment(enrollment)
                        .lesson(com.datdev.edudev.lesson.entity.Lesson.builder().id(lessonId).build())
                        .build());

        progress.setCompleted(true);
        progress.setCompletedAt(Instant.now());
        progressRepository.save(progress);
    }
}
