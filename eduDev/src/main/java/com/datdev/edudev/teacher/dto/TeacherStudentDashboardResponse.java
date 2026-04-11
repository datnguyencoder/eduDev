package com.datdev.edudev.teacher.dto;

import java.util.List;

public record TeacherStudentDashboardResponse(
        Long studentId,
        String studentName,
        long totalFeedbacks,
        List<FeedbackResponse> feedbacks
) {
}
