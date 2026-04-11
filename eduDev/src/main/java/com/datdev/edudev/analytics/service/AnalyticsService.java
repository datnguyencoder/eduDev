package com.datdev.edudev.analytics.service;

import com.datdev.edudev.analytics.dto.DashboardStatsResponse;
import com.datdev.edudev.analytics.dto.ContentAnalyticsResponse;
import com.datdev.edudev.analytics.dto.RecommendationAnalyticsResponse;
import com.datdev.edudev.auth.entity.Role;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.combo.repository.ComboRepository;
import com.datdev.edudev.combo.repository.EnrollmentRepository;
import com.datdev.edudev.lesson.repository.LessonRepository;
import com.datdev.edudev.major.repository.CareerRecommendationRepository;
import com.datdev.edudev.quiz.repository.QuizAttemptRepository;
import com.datdev.edudev.quiz.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final ComboRepository comboRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CareerRecommendationRepository recommendationRepository;

    public AnalyticsService(
            UserRepository userRepository,
            LessonRepository lessonRepository,
            QuizRepository quizRepository,
            ComboRepository comboRepository,
            EnrollmentRepository enrollmentRepository,
            QuizAttemptRepository quizAttemptRepository,
            CareerRecommendationRepository recommendationRepository
    ) {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.comboRepository = comboRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.recommendationRepository = recommendationRepository;
    }
    public DashboardStatsResponse getDashboardStats() {
        long students = userRepository.countByRole(Role.STUDENT);
        long teachers = userRepository.countByRole(Role.TEACHER);
        long lessons = lessonRepository.count();
        long quizzes = quizRepository.count();
        long enrollments = enrollmentRepository.count();
        long attempts = quizAttemptRepository.count();

        // Thống kê phân bổ status (Mock logic or simple aggregation)
        Map<String, Long> lessonStatusDist = lessonRepository.findAll().stream()
                .collect(Collectors.groupingBy(l -> l.getStatus().name(), Collectors.counting()));

        Map<String, Long> enrollmentDist = enrollmentRepository.findAll().stream()
                .collect(Collectors.groupingBy(e -> e.getStatus().name(), Collectors.counting()));

        return new DashboardStatsResponse(
                students, teachers, lessons, quizzes, enrollments, attempts,
                lessonStatusDist, enrollmentDist
        );
    }

    public ContentAnalyticsResponse getContentAnalytics() {
        Map<String, Long> lessonStatuses = lessonRepository.findAll().stream()
                .collect(Collectors.groupingBy(lesson -> lesson.getStatus().name(), Collectors.counting()));
        Map<String, Long> quizStatuses = quizRepository.findAll().stream()
                .collect(Collectors.groupingBy(quiz -> quiz.getStatus().name(), Collectors.counting()));
        Map<String, Long> comboStatuses = comboRepository.findAll().stream()
                .collect(Collectors.groupingBy(combo -> combo.getStatus().name(), Collectors.counting()));

        return new ContentAnalyticsResponse(
                lessonRepository.count(),
                quizRepository.count(),
                comboRepository.count(),
                lessonStatuses,
                quizStatuses,
                comboStatuses
        );
    }

    public RecommendationAnalyticsResponse getRecommendationAnalytics() {
        Map<String, Long> recommendationsByMajor = recommendationRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        recommendation -> recommendation.getSuggestedMajor() == null
                                ? "UNASSIGNED"
                                : recommendation.getSuggestedMajor().getName(),
                        Collectors.counting()
                ));

        long savedRecommendations = recommendationRepository.findAll().stream()
                .filter(recommendation -> Boolean.TRUE.equals(recommendation.getIsSaved()))
                .count();

        return new RecommendationAnalyticsResponse(
                recommendationRepository.count(),
                savedRecommendations,
                recommendationsByMajor
        );
    }
}
