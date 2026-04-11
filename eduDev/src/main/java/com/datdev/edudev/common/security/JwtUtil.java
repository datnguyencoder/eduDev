package com.datdev.edudev.common.security;

import com.datdev.edudev.common.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class JwtUtil {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String CLAIM_USER_ID = "uid";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_AUTHORITIES = "authorities";
    private static final String CLAIM_TOKEN_TYPE = "token_type";

    private final JwtProperties jwtProperties;
    private final SecretKey signingKey;

    public JwtUtil(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(CustomUserDetails userDetails) {
        return buildToken(userDetails, JwtTokenType.ACCESS, jwtProperties.accessTokenExpiration(), null);
    }

    public String generateRefreshToken(CustomUserDetails userDetails, UUID tokenId) {
        return buildToken(userDetails, JwtTokenType.REFRESH, jwtProperties.refreshTokenExpiration(), tokenId);
    }

    public CustomUserDetails parseAccessToken(String token) {
        Claims claims = parseToken(token, JwtTokenType.ACCESS);
        return buildUserDetails(claims);
    }

    public String resolveToken(String authorizationHeader) {
        if (!StringUtils.hasText(authorizationHeader) || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            return null;
        }

        String token = authorizationHeader.substring(BEARER_PREFIX.length()).trim();
        return StringUtils.hasText(token) ? token : null;
    }

    private String buildToken(
            CustomUserDetails userDetails,
            JwtTokenType tokenType,
            Duration expiration,
            UUID tokenId
    ) {
        Instant now = Instant.now();
        List<String> authorityNames = userDetails.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .toList();

        JwtBuilder jwtBuilder = Jwts.builder()
                .issuer(jwtProperties.issuer())
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expiration)))
                .claim(CLAIM_USER_ID, userDetails.getUserId())
                .claim(CLAIM_ROLE, userDetails.getRole())
                .claim(CLAIM_AUTHORITIES, authorityNames)
                .claim(CLAIM_TOKEN_TYPE, tokenType.name())
                .signWith(signingKey);

        if (tokenId != null) {
            jwtBuilder.id(tokenId.toString());
        }

        return jwtBuilder.compact();
    }

    private Claims parseToken(String token, JwtTokenType expectedTokenType) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .requireIssuer(jwtProperties.issuer())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String tokenTypeValue = claims.get(CLAIM_TOKEN_TYPE, String.class);
            JwtTokenType actualTokenType = JwtTokenType.valueOf(tokenTypeValue);

            if (actualTokenType != expectedTokenType) {
                throw new JwtAuthenticationException(
                        ErrorCode.INVALID_TOKEN,
                        "Provided token type is not allowed for this endpoint"
                );
            }

            return claims;
        } catch (ExpiredJwtException exception) {
            throw new JwtAuthenticationException(
                    ErrorCode.TOKEN_EXPIRED,
                    ErrorCode.TOKEN_EXPIRED.getMessage(),
                    exception
            );
        } catch (JwtAuthenticationException exception) {
            throw exception;
        } catch (JwtException | IllegalArgumentException exception) {
            throw new JwtAuthenticationException(
                    ErrorCode.INVALID_TOKEN,
                    ErrorCode.INVALID_TOKEN.getMessage(),
                    exception
            );
        }
    }

    private CustomUserDetails buildUserDetails(Claims claims) {
        Number userIdClaim = claims.get(CLAIM_USER_ID, Number.class);
        String email = claims.getSubject();
        String role = claims.get(CLAIM_ROLE, String.class);
        List<String> authorities = extractAuthorities(claims);

        if (userIdClaim == null || !StringUtils.hasText(email) || !StringUtils.hasText(role)) {
            throw new JwtAuthenticationException(
                    ErrorCode.INVALID_TOKEN,
                    "JWT payload is missing required claims"
            );
        }

        if (authorities.isEmpty()) {
            authorities = List.of("ROLE_" + role);
        }

        return CustomUserDetails.jwtPrincipal(
                userIdClaim.longValue(),
                email,
                role,
                authorities
        );
    }

    private List<String> extractAuthorities(Claims claims) {
        Object authorities = claims.get(CLAIM_AUTHORITIES);

        if (authorities instanceof Collection<?> authorityCollection) {
            return authorityCollection.stream()
                    .map(String::valueOf)
                    .toList();
        }

        return List.of();
    }
}
