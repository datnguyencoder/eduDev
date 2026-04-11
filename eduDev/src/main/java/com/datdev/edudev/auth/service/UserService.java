package com.datdev.edudev.auth.service;

import com.datdev.edudev.auth.dto.StudentProfileResponse;
import com.datdev.edudev.auth.dto.TeacherProfileResponse;
import com.datdev.edudev.auth.dto.UpdateProfileRequest;
import com.datdev.edudev.auth.dto.UpdateStudentProfileRequest;
import com.datdev.edudev.auth.dto.UpdateTeacherProfileRequest;
import com.datdev.edudev.auth.entity.StudentProfile;
import com.datdev.edudev.auth.entity.TeacherProfile;
import com.datdev.edudev.auth.dto.UserMeResponse;
import com.datdev.edudev.auth.entity.Role;
import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.mapper.UserMapper;
import com.datdev.edudev.auth.repository.StudentProfileRepository;
import com.datdev.edudev.auth.repository.TeacherProfileRepository;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
@Service
public class UserService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentRepository;
    private final TeacherProfileRepository teacherRepository;
    private final UserMapper userMapper;

    public UserService(
            UserRepository userRepository,
            StudentProfileRepository studentRepository,
            TeacherProfileRepository teacherRepository,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.userMapper = userMapper;
    }
    public UserMeResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));

        return userMapper.toMeResponse(user);
    }
    @Transactional
    public UserMeResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));

        user.setFullName(request.fullName());
        if (request.avatarUrl() != null) user.setAvatarUrl(request.avatarUrl());
        user.setUpdatedAt(Instant.now());

        if (user.getRole() == Role.STUDENT) {
            studentRepository.findByUserId(userId).ifPresent(p -> {
                if (request.grade() != null) p.setGrade(request.grade());
                if (request.targetExamYear() != null) p.setTargetExamYear(request.targetExamYear());
                if (request.interestedMajors() != null) p.setInterestedMajors(request.interestedMajors());
                if (request.favoriteSubjects() != null) p.setFavoriteSubjects(request.favoriteSubjects());
                p.setUpdatedAt(Instant.now());
                studentRepository.save(p);
            });
        } else if (user.getRole() == Role.TEACHER) {
            teacherRepository.findByUserId(userId).ifPresent(p -> {
                if (request.bio() != null) p.setBio(request.bio());
                if (request.specialization() != null) p.setSpecialization(request.specialization());
                if (request.yearsOfExperience() != null) p.setYearsOfExperience(request.yearsOfExperience());
                p.setUpdatedAt(Instant.now());
                teacherRepository.save(p);
            });
        }

        return userMapper.toMeResponse(userRepository.save(user));
    }

    public StudentProfileResponse getCurrentStudentProfile(Long userId) {
        User user = getUserOrThrow(userId);
        if (user.getRole() != Role.STUDENT) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Current user is not a student");
        }

        StudentProfile profile = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Student profile not found"));

        return toStudentProfileResponse(user, profile);
    }

    @Transactional
    public StudentProfileResponse updateCurrentStudentProfile(Long userId, UpdateStudentProfileRequest request) {
        User user = getUserOrThrow(userId);
        if (user.getRole() != Role.STUDENT) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Current user is not a student");
        }

        StudentProfile profile = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Student profile not found"));

        user.setFullName(request.fullName());
        user.setAvatarUrl(request.avatarUrl());
        user.setUpdatedAt(Instant.now());

        profile.setGrade(request.grade());
        profile.setTargetExamYear(request.targetExamYear());
        profile.setInterestedMajors(request.interestedMajors());
        profile.setFavoriteSubjects(request.favoriteSubjects());
        profile.setUpdatedAt(Instant.now());

        userRepository.save(user);
        studentRepository.save(profile);
        return toStudentProfileResponse(user, profile);
    }

    public TeacherProfileResponse getCurrentTeacherProfile(Long userId) {
        User user = getUserOrThrow(userId);
        if (user.getRole() != Role.TEACHER) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Current user is not a teacher");
        }

        TeacherProfile profile = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Teacher profile not found"));

        return toTeacherProfileResponse(user, profile);
    }

    @Transactional
    public TeacherProfileResponse updateCurrentTeacherProfile(Long userId, UpdateTeacherProfileRequest request) {
        User user = getUserOrThrow(userId);
        if (user.getRole() != Role.TEACHER) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Current user is not a teacher");
        }

        TeacherProfile profile = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Teacher profile not found"));

        user.setFullName(request.fullName());
        user.setAvatarUrl(request.avatarUrl());
        user.setUpdatedAt(Instant.now());

        profile.setSpecialization(request.specialization());
        profile.setYearsOfExperience(request.yearsOfExperience());
        profile.setBio(request.bio());
        profile.setUpdatedAt(Instant.now());

        userRepository.save(user);
        teacherRepository.save(profile);
        return toTeacherProfileResponse(user, profile);
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));
    }

    private StudentProfileResponse toStudentProfileResponse(User user, StudentProfile profile) {
        return new StudentProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                profile.getGrade(),
                profile.getTargetExamYear(),
                profile.getInterestedMajors(),
                profile.getFavoriteSubjects()
        );
    }

    private TeacherProfileResponse toTeacherProfileResponse(User user, TeacherProfile profile) {
        return new TeacherProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                profile.getSpecialization(),
                profile.getYearsOfExperience(),
                profile.getBio()
        );
    }
}
