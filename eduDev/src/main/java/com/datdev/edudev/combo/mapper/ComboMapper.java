package com.datdev.edudev.combo.mapper;

import com.datdev.edudev.combo.dto.*;
import com.datdev.edudev.combo.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ComboMapper {

    @Mapping(target = "status", expression = "java(combo.getStatus().name())")
    ComboResponse toResponse(Combo combo);

    @Mapping(target = "itemCount", expression = "java(combo.getItems().size())")
    ComboSummaryResponse toSummaryResponse(Combo combo);

    @Mapping(target = "subjectId", source = "subject.id")
    @Mapping(target = "subjectName", source = "subject.name")
    @Mapping(target = "topicId", source = "topic.id")
    @Mapping(target = "topicName", source = "topic.name")
    ComboItemDto toItemDto(ComboItem item);

    @Mapping(target = "comboId", source = "combo.id")
    @Mapping(target = "comboName", source = "combo.name")
    @Mapping(target = "status", expression = "java(enrollment.getStatus().name())")
    @Mapping(target = "progressPercent", ignore = true) // Will be calculated in service
    EnrollmentResponse toEnrollmentResponse(Enrollment enrollment);

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    ComboProgressResponse toProgressResponse(ComboProgress progress);

    List<ComboSummaryResponse> toSummaryResponseList(List<Combo> combos);
}
