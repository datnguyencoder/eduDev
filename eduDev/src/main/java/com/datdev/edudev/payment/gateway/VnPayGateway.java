package com.datdev.edudev.payment.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * VNPay Gateway — handles all signing, verification, and URL building.
 * All VNPay-specific crypto logic is isolated here.
 * <p>
 * Reference: https://sandbox.vnpayment.vn/apis/
 */
@Component
public class VnPayGateway {

    private static final Logger log = LoggerFactory.getLogger(VnPayGateway.class);
    private static final String HMAC_SHA512 = "HmacSHA512";
    private static final DateTimeFormatter VNP_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final VnPayConfig config;

    public VnPayGateway(VnPayConfig config) {
        this.config = config;
    }

    /**
     * Build VNPay payment URL with secure hash.
     *
     * @param txnRef      unique transaction reference
     * @param amount      payment amount (will be multiplied by 100 per VNPay spec)
     * @param orderInfo   description / order info text
     * @param ipAddress   client IP address
     * @return full redirect URL to VNPay gateway
     */
    public String buildPaymentUrl(String txnRef, BigDecimal amount, String orderInfo, String ipAddress) {
        Map<String, String> params = new TreeMap<>();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expire = now.plusMinutes(config.getDefaultExpireMinutes());

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", config.getTmnCode());
        params.put("vnp_Amount", amount.multiply(BigDecimal.valueOf(100)).toBigInteger().toString());
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", config.getReturnUrl());
        params.put("vnp_IpAddr", ipAddress);
        params.put("vnp_CreateDate", now.format(VNP_DATE_FORMAT));
        params.put("vnp_ExpireDate", expire.format(VNP_DATE_FORMAT));

        // Build query string and hash
        StringBuilder queryBuilder = new StringBuilder();
        StringBuilder hashDataBuilder = new StringBuilder();

        Iterator<Map.Entry<String, String>> iterator = params.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, String> entry = iterator.next();
            String key = entry.getKey();
            String value = entry.getValue();

            if (value != null && !value.isEmpty()) {
                // Build hash data (unencoded)
                hashDataBuilder.append(key).append('=').append(value);
                // Build query string (URL-encoded)
                queryBuilder.append(URLEncoder.encode(key, StandardCharsets.US_ASCII))
                        .append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));

                if (iterator.hasNext()) {
                    hashDataBuilder.append('&');
                    queryBuilder.append('&');
                }
            }
        }

        String hashData = hashDataBuilder.toString();
        String secureHash = hmacSHA512(config.getHashSecret(), hashData);

        queryBuilder.append("&vnp_SecureHash=").append(secureHash);

        String paymentUrl = config.getPayUrl() + "?" + queryBuilder;
        log.debug("VNPay payment URL generated for txnRef={}", txnRef);
        return paymentUrl;
    }

    /**
     * Verify the secure hash from a VNPay callback (IPN or return).
     *
     * @param params all query parameters from the callback
     * @return true if signature is valid
     */
    public boolean verifySecureHash(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null || receivedHash.isEmpty()) {
            log.warn("VNPay callback missing vnp_SecureHash");
            return false;
        }

        // Remove hash fields before computing
        Map<String, String> sortedParams = new TreeMap<>(params);
        sortedParams.remove("vnp_SecureHash");
        sortedParams.remove("vnp_SecureHashType");

        StringBuilder hashDataBuilder = new StringBuilder();
        Iterator<Map.Entry<String, String>> iterator = sortedParams.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, String> entry = iterator.next();
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                hashDataBuilder.append(entry.getKey()).append('=').append(entry.getValue());
                if (iterator.hasNext()) {
                    hashDataBuilder.append('&');
                }
            }
        }

        String computedHash = hmacSHA512(config.getHashSecret(), hashDataBuilder.toString());
        boolean valid = computedHash.equalsIgnoreCase(receivedHash);

        if (!valid) {
            log.warn("VNPay secure hash mismatch. Expected={}, Received={}", computedHash, receivedHash);
        }

        return valid;
    }

    /**
     * Extract the VNPay amount from callback params (divided by 100).
     */
    public BigDecimal extractAmount(Map<String, String> params) {
        String amountStr = params.get("vnp_Amount");
        if (amountStr == null) return BigDecimal.ZERO;
        return new BigDecimal(amountStr).divide(BigDecimal.valueOf(100));
    }

    /**
     * Check if VNPay response code indicates success.
     */
    public boolean isSuccessResponse(String responseCode) {
        return "00".equals(responseCode);
    }

    /**
     * Compute HMAC-SHA512 hash.
     */
    public String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance(HMAC_SHA512);
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_SHA512);
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            log.error("Error computing HMAC-SHA512", e);
            throw new RuntimeException("Error computing HMAC-SHA512", e);
        }
    }
}
