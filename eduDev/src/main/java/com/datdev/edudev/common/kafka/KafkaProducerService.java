package com.datdev.edudev.common.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }
    public void sendEvent(String topic, Object payload) {
        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            kafkaTemplate.send(topic, jsonPayload);
            log.info("Successfully sent event to topic [{}]: {}", topic, jsonPayload);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize event payload for topic [{}]: {}", topic, e.getMessage());
        } catch (Exception e) {
            log.error("Failed to send event to Kafka topic [{}]: {}", topic, e.getMessage());
        }
    }
}
