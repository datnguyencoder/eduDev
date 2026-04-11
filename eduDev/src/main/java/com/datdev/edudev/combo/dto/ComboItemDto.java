package com.datdev.edudev.combo.dto;

public record ComboItemDto(
        Long id,
        Long subjectId,
        String subjectName,
        Long topicId,
        String topicName,
        Integer displayOrder
) {
}
