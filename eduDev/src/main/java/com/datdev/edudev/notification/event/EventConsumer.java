package com.datdev.edudev.notification.event;

import com.datdev.edudev.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
@Component
@RequiredArgsConstructor
@Slf4j
public class EventConsumer {

    private final NotificationService notificationService;
    @KafkaListener(topics = "quiz-completed", groupId = "notification-group")
    public void handleQuizCompleted(String message) {
        log.info("Received quiz-completed event: {}", message);
        // Trích xuất userId, quizId, score từ JSON message (giả định payload đơn giản)
        // Ví dụ: {"userId": 1, "quizId": 10, "score": 85}
        
        // Mock gửi thông báo
        // Long userId = extractUserId(message);
        // notificationService.createNotification(userId, "Quiz Completed", "You scored 85% in your recent quiz!", "QUIZ");
    }
    @KafkaListener(topics = "enrollment-created", groupId = "notification-group")
    public void handleEnrollmentCreated(String message) {
        log.info("Received enrollment-created event: {}", message);
        // Trích xuất dữ liệu và tạo thông báo
    }
}
