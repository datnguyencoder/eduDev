package com.datdev.edudev.major.service;

import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.combo.entity.Enrollment;
import com.datdev.edudev.combo.repository.EnrollmentRepository;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.quiz.entity.QuizAttempt;
import com.datdev.edudev.quiz.repository.QuizAttemptRepository;
import com.datdev.edudev.major.dto.*;
import com.datdev.edudev.major.entity.*;
import com.datdev.edudev.major.mapper.MajorMapper;
import com.datdev.edudev.major.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class RecommendationService {

    private final CareerRecommendationRepository recommendationRepository;
    private final MajorRepository majorRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final MajorMapper majorMapper;

    public RecommendationService(
            CareerRecommendationRepository recommendationRepository,
            MajorRepository majorRepository,
            QuizAttemptRepository quizAttemptRepository,
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            MajorMapper majorMapper
    ) {
        this.recommendationRepository = recommendationRepository;
        this.majorRepository = majorRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.majorMapper = majorMapper;
    }
    @Transactional
    public RecommendationResponse generateRecommendation(Long userId, RecommendationRequest request) {
        User student = userRepository.findById(userId).orElseThrow();

        // 1. Phân tích kết quả học tập (Mock analysis)
        // Lấy các quiz attempts gần nhất để xem thế mạnh môn học
        // List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdAndQuizIdOrderByCreatedAtDesc(userId, ...);
        
        // 2. Mock AI Recommendation logic
        // Giả sử chọn ngành CNTT nếu có nhiều quiz score cao hoặc interest chứa 'tech'
        List<Major> allMajors = majorRepository.findAll();
        Major suggestedMajor = allMajors.isEmpty() ? null : allMajors.get(0); 

        String reasoning = "Based on your strong performance in Mathematics and Logical Reasoning quizzes, " +
                "and your active participation in the 'Algorithm Mastery' combo, we suggest pursuing a career in Computer Science.";
        
        if (request.interests() != null && request.interests().toLowerCase().contains("code")) {
             reasoning += " Your expressed interest in coding aligns perfectly with this suggestion.";
        }

        CareerRecommendation recommendation = CareerRecommendation.builder()
                .student(student)
                .suggestedMajor(suggestedMajor)
                .reasoning(reasoning)
                .confidenceScore(new BigDecimal("0.85"))
                .isSaved(false)
                .build();

        return majorMapper.toRecommendationResponse(recommendationRepository.save(recommendation));
    }

    public List<RecommendationResponse> getMyRecommendations(Long userId) {
        return majorMapper.toRecommendationResponseList(recommendationRepository.findByStudentIdOrderByCreatedAtDesc(userId));
    }

    @Transactional
    public RecommendationResponse saveRecommendation(Long userId, Long recommendationId) {
        CareerRecommendation rec = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Recommendation not found"));
        
        if (!rec.getStudent().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You cannot update another student's recommendation");
        }

        rec.setIsSaved(true);
        return majorMapper.toRecommendationResponse(recommendationRepository.save(rec));
    }
}
