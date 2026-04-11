package com.datdev.edudev.lesson.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.lesson.dto.LessonResponse;
import com.datdev.edudev.lesson.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/topics")
@Tag(name = "Topic Lessons", description = "Nested lesson queries by topic")
public class TopicLessonController {

    private final LessonService lessonService;

    public TopicLessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/{id}/lessons")
    @Operation(summary = "Get published lessons of a topic")
    public ApiResponse<List<LessonResponse>> getLessonsByTopic(@PathVariable("id") Long topicId) {
        return ApiResponse.success("Lessons retrieved successfully", lessonService.getPublishedLessonsByTopic(topicId));
    }
}
