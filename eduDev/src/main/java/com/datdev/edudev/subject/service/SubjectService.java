package com.datdev.edudev.subject.service;

import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.subject.dto.CreateSubjectRequest;
import com.datdev.edudev.subject.dto.SubjectResponse;
import com.datdev.edudev.subject.entity.Subject;
import com.datdev.edudev.subject.mapper.SubjectMapper;
import com.datdev.edudev.subject.repository.SubjectRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final SubjectMapper subjectMapper;

    public SubjectService(SubjectRepository subjectRepository, SubjectMapper subjectMapper) {
        this.subjectRepository = subjectRepository;
        this.subjectMapper = subjectMapper;
    }

    @Cacheable(value = "subjects")
    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(subjectMapper::toResponse)
                .toList();
    }

    @Transactional
    @CacheEvict(value = "subjects", allEntries = true)
    public SubjectResponse createSubject(CreateSubjectRequest request) {
        if (subjectRepository.existsByName(request.name())) {
            throw new BusinessException(ErrorCode.DUPLICATE_RESOURCE, "Subject name already exists");
        }

        Subject subject = Subject.builder()
                .name(request.name())
                .description(request.description())
                .iconUrl(request.iconUrl())
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
                .build();

        return subjectMapper.toResponse(subjectRepository.save(subject));
    }

    @Transactional
    @CacheEvict(value = "subjects", allEntries = true)
    public SubjectResponse updateSubject(Long id, CreateSubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Subject not found"));

        subject.setName(request.name());
        subject.setDescription(request.description());
        subject.setIconUrl(request.iconUrl());
        if (request.displayOrder() != null) {
            subject.setDisplayOrder(request.displayOrder());
        }
        subject.setUpdatedAt(Instant.now());

        return subjectMapper.toResponse(subjectRepository.save(subject));
    }
}
