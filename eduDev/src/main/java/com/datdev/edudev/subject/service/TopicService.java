package com.datdev.edudev.subject.service;

import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.subject.dto.CreateTopicRequest;
import com.datdev.edudev.subject.dto.TopicResponse;
import com.datdev.edudev.subject.entity.Subject;
import com.datdev.edudev.subject.entity.Topic;
import com.datdev.edudev.subject.mapper.TopicMapper;
import com.datdev.edudev.subject.repository.SubjectRepository;
import com.datdev.edudev.subject.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class TopicService {

    private final TopicRepository topicRepository;
    private final SubjectRepository subjectRepository;
    private final TopicMapper topicMapper;

    public TopicService(TopicRepository topicRepository, SubjectRepository subjectRepository, TopicMapper topicMapper) {
        this.topicRepository = topicRepository;
        this.subjectRepository = subjectRepository;
        this.topicMapper = topicMapper;
    }

    public List<TopicResponse> getTopicsBySubject(Long subjectId) {
        return topicRepository.findBySubjectIdOrderByDisplayOrderAsc(subjectId).stream()
                .map(topicMapper::toResponse)
                .toList();
    }

    @Transactional
    public TopicResponse createTopic(CreateTopicRequest request) {
        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Subject not found"));

        Topic topic = Topic.builder()
                .subject(subject)
                .name(request.name())
                .description(request.description())
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
                .build();

        return topicMapper.toResponse(topicRepository.save(topic));
    }

    @Transactional
    public TopicResponse updateTopic(Long id, CreateTopicRequest request) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Topic not found"));

        topic.setName(request.name());
        topic.setDescription(request.description());
        if (request.displayOrder() != null) {
            topic.setDisplayOrder(request.displayOrder());
        }
        topic.setUpdatedAt(Instant.now());

        return topicMapper.toResponse(topicRepository.save(topic));
    }
}
