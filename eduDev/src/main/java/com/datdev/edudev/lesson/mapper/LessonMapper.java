package com.datdev.edudev.lesson.mapper;

import com.datdev.edudev.lesson.dto.LessonResponse;
import com.datdev.edudev.lesson.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    @Mapping(target = "topicId", source = "topic.id")
    @Mapping(target = "status", expression = "java(lesson.getStatus().name())")
    @Mapping(target = "difficulty", expression = "java(lesson.getDifficulty().name())")
    LessonResponse toResponse(Lesson lesson);
}
