package com.datdev.edudev.notification.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.notification.dto.*;
import com.datdev.edudev.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/notifications")
@Tag(name = "Notifications", description = "Endpoints for user alerts and notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get user's notifications")
    public ApiResponse<List<NotificationResponse>> getNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "false") boolean unreadOnly
    ) {
        return ApiResponse.success("Notifications retrieved", notificationService.getMyNotifications(userDetails.getUserId(), unreadOnly));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notifications count")
    public ApiResponse<UnreadCountResponse> getUnreadCount(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.success("Unread count retrieved", notificationService.getUnreadCount(userDetails.getUserId()));
    }

    @PostMapping("/{id}/read")
    @Operation(summary = "Mark a specific notification as read")
    public ApiResponse<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        notificationService.markAsRead(userDetails.getUserId(), id);
        return ApiResponse.success("Notification marked as read", null);
    }
}
