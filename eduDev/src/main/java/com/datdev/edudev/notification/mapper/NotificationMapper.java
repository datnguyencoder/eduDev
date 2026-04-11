package com.datdev.edudev.notification.mapper;

import com.datdev.edudev.notification.dto.NotificationResponse;
import com.datdev.edudev.notification.entity.Notification;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationResponse toResponse(Notification notification);
    List<NotificationResponse> toResponseList(List<Notification> notifications);
}
