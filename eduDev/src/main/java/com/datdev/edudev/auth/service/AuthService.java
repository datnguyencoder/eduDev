package com.datdev.edudev.auth.service;

import com.datdev.edudev.auth.dto.AuthResponse;
import com.datdev.edudev.auth.dto.LoginRequest;
import com.datdev.edudev.auth.dto.RefreshTokenRequest;
import com.datdev.edudev.auth.dto.StudentRegisterRequest;
import com.datdev.edudev.auth.entity.Role;
import com.datdev.edudev.auth.entity.StudentProfile;
import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.entity.UserStatus;
import com.datdev.edudev.auth.repository.StudentProfileRepository;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.common.security.JwtProperties;
import com.datdev.edudev.common.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;
    private final RefreshTokenService refreshTokenService;

    public AuthService(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            JwtProperties jwtProperties,
            RefreshTokenService refreshTokenService
    ) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.jwtProperties = jwtProperties;
        this.refreshTokenService = refreshTokenService;
    }
    @Transactional
    public AuthResponse registerStudent(StudentRegisterRequest request) {
        // Check email trùng
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Tạo User
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();
        user = userRepository.save(user);

        // Tạo StudentProfile
        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .grade(request.grade())
                .targetExamYear(request.targetExamYear())
                .build();
        studentProfileRepository.save(profile);

        // Tự động login
        return generateTokens(user);
    }
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        validateUserStatus(user);

        return generateTokens(user);
    }
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        JwtUtil.RefreshTokenClaims claims = jwtUtil.parseRefreshToken(request.refreshToken());

        // Validate token còn hợp lệ trong Redis
        refreshTokenService.validateRefreshToken(claims.userId(), claims.tokenId());

        // Lấy user mới nhất từ DB để check status
        User user = userRepository.findById(claims.userId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));

        validateUserStatus(user);

        // Rotation: xóa token cũ, tạo token mới
        UUID newTokenId = refreshTokenService.rotateRefreshToken(
                claims.userId(),
                claims.tokenId(),
                jwtProperties.refreshTokenExpiration()
        );

        CustomUserDetails userDetails = buildUserDetails(user);
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshTokenStr = jwtUtil.generateRefreshToken(userDetails, newTokenId);

        return new AuthResponse(accessToken, refreshTokenStr, user.getRole().name(), user.getId());
    }
    public void logout(RefreshTokenRequest request) {
        try {
            JwtUtil.RefreshTokenClaims claims = jwtUtil.parseRefreshToken(request.refreshToken());
            refreshTokenService.revokeRefreshToken(claims.userId(), claims.tokenId());
        } catch (Exception ignored) {
            // Logout luôn thành công dù token invalid.
            // Không cần throw error vì mục tiêu là revoke token.
        }
    }

    // === PRIVATE HELPERS ===

    private AuthResponse generateTokens(User user) {
        CustomUserDetails userDetails = buildUserDetails(user);

        // Tạo refresh token trong Redis
        UUID tokenId = refreshTokenService.createRefreshToken(
                user.getId(),
                jwtProperties.refreshTokenExpiration()
        );

        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails, tokenId);

        return new AuthResponse(accessToken, refreshToken, user.getRole().name(), user.getId());
    }

    private CustomUserDetails buildUserDetails(User user) {
        List<String> authorities = List.of("ROLE_" + user.getRole().name());
        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getRole().name(),
                user.getStatus() == UserStatus.ACTIVE,
                authorities.stream()
                        .map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
                        .toList()
        );
    }

    private void validateUserStatus(User user) {
        if (user.getStatus() == UserStatus.BANNED) {
            throw new BusinessException(ErrorCode.USER_BANNED);
        }
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new BusinessException(ErrorCode.USER_INACTIVE);
        }
    }
}
