package com.datdev.edudev.major.service;

import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.major.dto.MajorResponse;
import com.datdev.edudev.major.dto.MajorUpsertRequest;
import com.datdev.edudev.major.dto.ReorderWishlistRequest;
import com.datdev.edudev.major.dto.WishlistMajorResponse;
import com.datdev.edudev.major.dto.WishlistRequest;
import com.datdev.edudev.major.entity.Major;
import com.datdev.edudev.major.entity.StudentWishlist;
import com.datdev.edudev.major.mapper.MajorMapper;
import com.datdev.edudev.major.repository.MajorRepository;
import com.datdev.edudev.major.repository.StudentWishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MajorService {

    private final MajorRepository majorRepository;
    private final StudentWishlistRepository studentWishlistRepository;
    private final UserRepository userRepository;
    private final MajorMapper majorMapper;

    public MajorService(
            MajorRepository majorRepository,
            StudentWishlistRepository studentWishlistRepository,
            UserRepository userRepository,
            MajorMapper majorMapper
    ) {
        this.majorRepository = majorRepository;
        this.studentWishlistRepository = studentWishlistRepository;
        this.userRepository = userRepository;
        this.majorMapper = majorMapper;
    }

    public List<MajorResponse> getMajors(String group) {
        List<Major> majors = group == null || group.isBlank()
                ? majorRepository.findAll()
                : majorRepository.findByGroupName(group);
        return majorMapper.toResponseList(majors);
    }

    public MajorResponse getMajorById(Long id) {
        return majorMapper.toResponse(findMajorOrThrow(id));
    }

    @Transactional
    public MajorResponse createMajor(MajorUpsertRequest request) {
        boolean codeExists = majorRepository.findAll().stream()
                .anyMatch(existing -> existing.getCode().equalsIgnoreCase(request.code()));
        if (codeExists) {
            throw new BusinessException(ErrorCode.DUPLICATE_RESOURCE, "Major code already exists");
        }

        Major major = Major.builder()
                .code(request.code())
                .name(request.name())
                .description(request.description())
                .groupName(request.groupName())
                .build();
        return majorMapper.toResponse(majorRepository.save(major));
    }

    @Transactional
    public MajorResponse updateMajor(Long id, MajorUpsertRequest request) {
        Major major = findMajorOrThrow(id);
        major.setCode(request.code());
        major.setName(request.name());
        major.setDescription(request.description());
        major.setGroupName(request.groupName());
        return majorMapper.toResponse(majorRepository.save(major));
    }

    public List<WishlistMajorResponse> getWishlist(Long studentId) {
        return studentWishlistRepository.findByStudentIdOrderByPriorityAsc(studentId).stream()
                .map(this::toWishlistResponse)
                .toList();
    }

    @Transactional
    public List<WishlistMajorResponse> addWishlistMajor(Long studentId, WishlistRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Student not found"));
        Major major = findMajorOrThrow(request.majorId());

        if (studentWishlistRepository.existsByStudentIdAndMajorId(studentId, request.majorId())) {
            throw new BusinessException(ErrorCode.DUPLICATE_RESOURCE, "Major already exists in wishlist");
        }

        List<StudentWishlist> current = studentWishlistRepository.findByStudentIdOrderByPriorityAsc(studentId);
        int targetPriority = request.priority() == null || request.priority() < 1
                ? current.size() + 1
                : Math.min(request.priority(), current.size() + 1);

        current.stream()
                .filter(item -> item.getPriority() >= targetPriority)
                .forEach(item -> item.setPriority(item.getPriority() + 1));

        StudentWishlist wishlist = StudentWishlist.builder()
                .student(student)
                .major(major)
                .priority(targetPriority)
                .build();

        studentWishlistRepository.saveAll(current);
        studentWishlistRepository.save(wishlist);
        return getWishlist(studentId);
    }

    @Transactional
    public List<WishlistMajorResponse> reorderWishlist(Long studentId, ReorderWishlistRequest request) {
        List<StudentWishlist> current = studentWishlistRepository.findByStudentIdOrderByPriorityAsc(studentId);
        if (current.isEmpty()) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Wishlist is empty");
        }

        Set<Long> currentMajorIds = current.stream()
                .map(item -> item.getMajor().getId())
                .collect(java.util.stream.Collectors.toCollection(HashSet::new));
        Set<Long> requestedMajorIds = new HashSet<>(request.majorIds());

        if (!currentMajorIds.equals(requestedMajorIds) || request.majorIds().size() != current.size()) {
            throw new BusinessException(ErrorCode.MALFORMED_REQUEST, "Reorder payload must contain the exact current wishlist majors");
        }

        for (int i = 0; i < request.majorIds().size(); i++) {
            Long majorId = request.majorIds().get(i);
            int newPriority = i + 1;
            current.stream()
                    .filter(item -> item.getMajor().getId().equals(majorId))
                    .findFirst()
                    .ifPresent(item -> item.setPriority(newPriority));
        }

        studentWishlistRepository.saveAll(current);
        return getWishlist(studentId);
    }

    private Major findMajorOrThrow(Long id) {
        return majorRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Major not found"));
    }

    private WishlistMajorResponse toWishlistResponse(StudentWishlist wishlist) {
        return new WishlistMajorResponse(
                wishlist.getId(),
                wishlist.getMajor().getId(),
                wishlist.getMajor().getCode(),
                wishlist.getMajor().getName(),
                wishlist.getPriority()
        );
    }
}
