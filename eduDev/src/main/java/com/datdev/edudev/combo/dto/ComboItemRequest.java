package com.datdev.edudev.combo.dto;

public record ComboItemRequest(
        Long subjectId,
        Long topicId,
        Integer displayOrder
) {
}
