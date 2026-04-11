package com.datdev.edudev.major.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.major.dto.ReorderWishlistRequest;
import com.datdev.edudev.major.dto.WishlistMajorResponse;
import com.datdev.edudev.major.dto.WishlistRequest;
import com.datdev.edudev.major.service.MajorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/users/me/wishlist-majors")
@Tag(name = "Wishlist Majors", description = "Student wishlist major endpoints")
@PreAuthorize("hasRole('STUDENT')")
public class UserWishlistController {

    private final MajorService majorService;

    public UserWishlistController(MajorService majorService) {
        this.majorService = majorService;
    }

    @GetMapping
    @Operation(summary = "Get wishlist majors")
    public ApiResponse<List<WishlistMajorResponse>> getWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Wishlist retrieved", majorService.getWishlist(userDetails.getUserId()));
    }

    @PostMapping
    @Operation(summary = "Add a major to wishlist")
    public ApiResponse<List<WishlistMajorResponse>> addWishlistMajor(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody WishlistRequest request
    ) {
        return ApiResponse.success("Wishlist updated", majorService.addWishlistMajor(userDetails.getUserId(), request));
    }

    @PutMapping("/reorder")
    @Operation(summary = "Reorder wishlist majors")
    public ApiResponse<List<WishlistMajorResponse>> reorderWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ReorderWishlistRequest request
    ) {
        return ApiResponse.success("Wishlist reordered", majorService.reorderWishlist(userDetails.getUserId(), request));
    }
}
