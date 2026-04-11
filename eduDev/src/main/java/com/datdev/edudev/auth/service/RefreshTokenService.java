package com.datdev.edudev.auth.service;

import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;
@Service
public class RefreshTokenService {

    private static final String KEY_PREFIX = "refresh_token:";
    private static final String VALID_VALUE = "valid";

    private final StringRedisTemplate redisTemplate;

    public RefreshTokenService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    public UUID createRefreshToken(Long userId, Duration ttl) {
        UUID tokenId = UUID.randomUUID();
        String key = buildKey(userId, tokenId);
        redisTemplate.opsForValue().set(key, VALID_VALUE, ttl);
        return tokenId;
    }
    public void validateRefreshToken(Long userId, UUID tokenId) {
        String key = buildKey(userId, tokenId);
        String value = redisTemplate.opsForValue().get(key);

        if (!VALID_VALUE.equals(value)) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_REVOKED);
        }
    }
    public void revokeRefreshToken(Long userId, UUID tokenId) {
        String key = buildKey(userId, tokenId);
        redisTemplate.delete(key);
    }
    public UUID rotateRefreshToken(Long userId, UUID oldTokenId, Duration ttl) {
        revokeRefreshToken(userId, oldTokenId);
        return createRefreshToken(userId, ttl);
    }

    private String buildKey(Long userId, UUID tokenId) {
        return KEY_PREFIX + userId + ":" + tokenId;
    }
}
