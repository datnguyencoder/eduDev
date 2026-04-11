package com.datdev.edudev.teacher.mapper;

import com.datdev.edudev.teacher.dto.*;
import com.datdev.edudev.teacher.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeacherMapper {

    @Mapping(target = "teacherId", source = "teacher.id")
    @Mapping(target = "teacherName", source = "teacher.fullName")
    @Mapping(target = "targetId", source = "subject.id")
    @Mapping(target = "targetName", source = "subject.name")
    @Mapping(target = "status", constant = "ACTIVE")
    TeacherAssignmentDto toSubjectAssignmentDto(TeacherSubjectAssignment assignment);

    @Mapping(target = "teacherId", source = "teacher.id")
    @Mapping(target = "teacherName", source = "teacher.fullName")
    @Mapping(target = "targetId", source = "student.id")
    @Mapping(target = "targetName", source = "student.fullName")
    TeacherAssignmentDto toStudentAssignmentDto(TeacherStudentAssignment assignment);

    @Mapping(target = "teacherId", source = "teacher.id")
    @Mapping(target = "teacherName", source = "teacher.fullName")
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "studentName", source = "student.fullName")
    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    FeedbackResponse toFeedbackResponse(TeacherFeedback feedback);

    List<TeacherAssignmentDto> toSubjectAssignmentDtoList(List<TeacherSubjectAssignment> assignments);
    List<TeacherAssignmentDto> toStudentAssignmentDtoList(List<TeacherStudentAssignment> assignments);
    List<FeedbackResponse> toFeedbackResponseList(List<TeacherFeedback> feedbacks);
}
