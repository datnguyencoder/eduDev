package com.datdev.edudev.subject.mapper;

import com.datdev.edudev.subject.dto.TopicResponse;
import com.datdev.edudev.subject.entity.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TopicMapper {

    @Mapping(target = "subjectId", source = "subject.id")
    TopicResponse toResponse(Topic topic);
}
