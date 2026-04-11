package com.datdev.edudev.major.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.major.dto.*;
import com.datdev.edudev.major.service.RecommendationService;
import com.datdev.edudev.major.repository.MajorRepository;
import com.datdev.edudev.major.mapper.MajorMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/majors")
@Tag(name = "Majors & Recommendations", description = "Endpoints for university majors and career discovery")
public class MajorController {

    private final RecommendationService recommendationService;
    private final MajorRepository majorRepository;
    private final MajorMapper majorMapper;

    public MajorController(
            RecommendationService recommendationService,
            MajorRepository majorRepository,
            MajorMapper majorMapper
    ) {
        this.recommendationService = recommendationService;
        this.majorRepository = majorRepository;
        this.majorMapper = majorMapper;
    }

    @GetMapping
    @Operation(summary = "Get list of university majors")
    public ApiResponse<List<MajorResponse>> getAllMajors(@RequestParam(required = false) String group) {
        if (group != null) {
            return ApiResponse.success("Majors retrieved", majorMapper.toResponseList(majorRepository.findByGroupName(group)));
        }
        return ApiResponse.success("Majors retrieved", majorMapper.toResponseList(majorRepository.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get major details")
    public ApiResponse<MajorResponse> getMajorById(@PathVariable Long id) {
        return ApiResponse.success(
                "Major retrieved",
                majorMapper.toResponse(
                        majorRepository.findById(id)
                                .orElseThrow(() -> new com.datdev.edudev.common.exception.BusinessException(
                                        com.datdev.edudev.common.exception.ErrorCode.RESOURCE_NOT_FOUND,
                                        "Major not found"
                                ))
                )
        );
    }

    @PostMapping("/recommendations/generate")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Generate career recommendation using AI/Rule-engine (Student only)")
    public ApiResponse<RecommendationResponse> generateRecommendation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody RecommendationRequest request
    ) {
        return ApiResponse.success("Recommendation generated", recommendationService.generateRecommendation(userDetails.getUserId(), request));
    }

    @GetMapping("/recommendations/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's recommendation history")
    public ApiResponse<List<RecommendationResponse>> getMyRecommendations(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.success("Recommendation history retrieved", recommendationService.getMyRecommendations(userDetails.getUserId()));
    }

    @PostMapping("/recommendations/{id}/save")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Save a specific recommendation (Student only)")
    public ApiResponse<RecommendationResponse> saveRecommendation(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Recommendation saved", recommendationService.saveRecommendation(userDetails.getUserId(), id));
    }
}
