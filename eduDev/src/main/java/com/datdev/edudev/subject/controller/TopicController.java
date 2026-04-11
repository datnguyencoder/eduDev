package com.datdev.edudev.subject.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.subject.dto.CreateTopicRequest;
import com.datdev.edudev.subject.dto.TopicResponse;
import com.datdev.edudev.subject.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/topics")
@Tag(name = "Topics", description = "Endpoints for managing topics within subjects")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get all topics for a given subject (Publicly accessible)")
    public ApiResponse<List<TopicResponse>> getTopicsBySubject(@PathVariable Long subjectId) {
        return ApiResponse.success("Topics retrieved successfully", topicService.getTopicsBySubject(subjectId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new topic (Admin only)")
    public ApiResponse<TopicResponse> createTopic(@Valid @RequestBody CreateTopicRequest request) {
        return ApiResponse.success("Topic created successfully", topicService.createTopic(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing topic (Admin only)")
    public ApiResponse<TopicResponse> updateTopic(@PathVariable Long id, @Valid @RequestBody CreateTopicRequest request) {
        return ApiResponse.success("Topic updated successfully", topicService.updateTopic(id, request));
    }
}
