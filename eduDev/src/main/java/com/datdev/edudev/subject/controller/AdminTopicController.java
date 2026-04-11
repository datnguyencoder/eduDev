package com.datdev.edudev.subject.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.subject.dto.CreateTopicRequest;
import com.datdev.edudev.subject.dto.TopicResponse;
import com.datdev.edudev.subject.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/admin/topics")
@Tag(name = "Admin Topics", description = "Admin-only topic management endpoints")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTopicController {

    private final TopicService topicService;

    public AdminTopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @PostMapping
    @Operation(summary = "Create a topic")
    public ApiResponse<TopicResponse> create(@Valid @RequestBody CreateTopicRequest request) {
        return ApiResponse.success("Topic created successfully", topicService.createTopic(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a topic")
    public ApiResponse<TopicResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateTopicRequest request
    ) {
        return ApiResponse.success("Topic updated successfully", topicService.updateTopic(id, request));
    }
}
