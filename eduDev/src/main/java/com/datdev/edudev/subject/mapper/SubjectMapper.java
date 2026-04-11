package com.datdev.edudev.subject.mapper;

import com.datdev.edudev.subject.dto.SubjectResponse;
import com.datdev.edudev.subject.entity.Subject;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubjectMapper {
    SubjectResponse toResponse(Subject subject);
}
