package com.datdev.edudev.subject.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.subject.dto.TopicResponse;
import com.datdev.edudev.subject.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/subjects")
@Tag(name = "Subject Topics", description = "Nested topic queries by subject")
public class SubjectTopicController {

    private final TopicService topicService;

    public SubjectTopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping("/{id}/topics")
    @Operation(summary = "Get topics of a subject")
    public ApiResponse<List<TopicResponse>> getTopicsBySubject(@PathVariable("id") Long subjectId) {
        return ApiResponse.success("Topics retrieved successfully", topicService.getTopicsBySubject(subjectId));
    }
}
