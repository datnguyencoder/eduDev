package com.datdev.edudev.notification.service;

import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.notification.dto.*;
import com.datdev.edudev.notification.entity.Notification;
import com.datdev.edudev.notification.mapper.NotificationMapper;
import com.datdev.edudev.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            NotificationMapper notificationMapper
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationMapper = notificationMapper;
    }

    public List<NotificationResponse> getMyNotifications(Long userId, boolean onlyUnread) {
        List<Notification> notifications;
        if (onlyUnread) {
            notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        } else {
            notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return notificationMapper.toResponseList(notifications);
    }

    public UnreadCountResponse getUnreadCount(Long userId) {
        return new UnreadCountResponse(notificationRepository.countByUserIdAndIsReadFalse(userId));
    }

    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You cannot access another user's notification");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void createNotification(Long userId, String title, String content, String type) {
        Notification notification = Notification.builder()
                .user(userRepository.getReferenceById(userId))
                .title(title)
                .content(content)
                .type(type)
                .build();
        notificationRepository.save(notification);
    }
}
