package com.datdev.edudev.major.mapper;

import com.datdev.edudev.major.dto.*;
import com.datdev.edudev.major.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MajorMapper {

    MajorResponse toResponse(Major major);

    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "suggestedMajorId", source = "suggestedMajor.id")
    @Mapping(target = "suggestedMajorName", source = "suggestedMajor.name")
    @Mapping(target = "suggestedMajorCode", source = "suggestedMajor.code")
    RecommendationResponse toRecommendationResponse(CareerRecommendation recommendation);

    List<MajorResponse> toResponseList(List<Major> majors);
    List<RecommendationResponse> toRecommendationResponseList(List<CareerRecommendation> recommendations);
}
