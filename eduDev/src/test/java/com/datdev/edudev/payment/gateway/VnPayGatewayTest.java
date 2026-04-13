package com.datdev.edudev.payment.gateway;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import static org.junit.jupiter.api.Assertions.*;

class VnPayGatewayTest {

    private VnPayGateway gateway;
    private VnPayConfig config;

    private static final String TEST_SECRET = "TESTSECRETKEY1234567890ABCDEF";
    private static final String TEST_TMN_CODE = "TESTCODE";

    @BeforeEach
    void setUp() {
        config = new VnPayConfig();
        config.setTmnCode(TEST_TMN_CODE);
        config.setHashSecret(TEST_SECRET);
        config.setPayUrl("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html");
        config.setReturnUrl("http://localhost:8080/api/v1/public/payments/vnpay/return");
        config.setDefaultExpireMinutes(15);

        gateway = new VnPayGateway(config);
    }

    @Test
    @DisplayName("hmacSHA512 should produce consistent hash for same input")
    void hmacSHA512_consistency() {
        String data = "key1=value1&key2=value2";
        String hash1 = gateway.hmacSHA512(TEST_SECRET, data);
        String hash2 = gateway.hmacSHA512(TEST_SECRET, data);

        assertNotNull(hash1);
        assertFalse(hash1.isEmpty());
        assertEquals(hash1, hash2, "Same input should produce same hash");
        assertEquals(128, hash1.length(), "HMAC-SHA512 should produce 128 hex characters");
    }

    @Test
    @DisplayName("hmacSHA512 should produce different hash for different data")
    void hmacSHA512_differentData() {
        String hash1 = gateway.hmacSHA512(TEST_SECRET, "data1");
        String hash2 = gateway.hmacSHA512(TEST_SECRET, "data2");

        assertNotEquals(hash1, hash2, "Different data should produce different hashes");
    }

    @Test
    @DisplayName("hmacSHA512 should produce different hash for different keys")
    void hmacSHA512_differentKeys() {
        String data = "same-data";
        String hash1 = gateway.hmacSHA512("key1-with-enough-length", data);
        String hash2 = gateway.hmacSHA512("key2-with-enough-length", data);

        assertNotEquals(hash1, hash2, "Different keys should produce different hashes");
    }

    @Test
    @DisplayName("buildPaymentUrl should contain all required VNPay parameters")
    void buildPaymentUrl_containsRequiredParams() {
        String url = gateway.buildPaymentUrl("TXN123", BigDecimal.valueOf(100000), "Test order", "127.0.0.1");

        assertNotNull(url);
        assertTrue(url.startsWith("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?"));
        assertTrue(url.contains("vnp_TmnCode=" + TEST_TMN_CODE));
        assertTrue(url.contains("vnp_TxnRef=TXN123"));
        assertTrue(url.contains("vnp_Amount=10000000")); // 100000 * 100
        assertTrue(url.contains("vnp_Command=pay"));
        assertTrue(url.contains("vnp_Version=2.1.0"));
        assertTrue(url.contains("vnp_SecureHash="));
        assertTrue(url.contains("vnp_ReturnUrl="));
    }

    @Test
    @DisplayName("buildPaymentUrl amount should be multiplied by 100")
    void buildPaymentUrl_amountMultipliedBy100() {
        String url = gateway.buildPaymentUrl("TXN1", BigDecimal.valueOf(50000), "Test", "127.0.0.1");
        assertTrue(url.contains("vnp_Amount=5000000"), "Amount should be 50000 * 100 = 5000000");

        String url2 = gateway.buildPaymentUrl("TXN2", new BigDecimal("199500"), "Test", "127.0.0.1");
        assertTrue(url2.contains("vnp_Amount=19950000"), "Amount should be 199500 * 100 = 19950000");
    }

    @Test
    @DisplayName("verifySecureHash should return true for valid hash")
    void verifySecureHash_validHash() {
        // Build params in sorted order (TreeMap) and compute expected hash
        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Amount", "10000000");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", TEST_TMN_CODE);
        params.put("vnp_TxnRef", "TXN123");
        params.put("vnp_ResponseCode", "00");

        // Compute hash for the sorted params
        StringBuilder hashData = new StringBuilder();
        params.forEach((key, value) -> {
            if (hashData.length() > 0) hashData.append('&');
            hashData.append(key).append('=').append(value);
        });

        String expectedHash = gateway.hmacSHA512(TEST_SECRET, hashData.toString());
        params.put("vnp_SecureHash", expectedHash);

        assertTrue(gateway.verifySecureHash(params), "Hash should be valid");
    }

    @Test
    @DisplayName("verifySecureHash should return false for tampered data")
    void verifySecureHash_tamperedData() {
        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Amount", "10000000");
        params.put("vnp_TxnRef", "TXN123");
        params.put("vnp_ResponseCode", "00");

        // Compute hash
        StringBuilder hashData = new StringBuilder();
        params.forEach((key, value) -> {
            if (hashData.length() > 0) hashData.append('&');
            hashData.append(key).append('=').append(value);
        });
        String hash = gateway.hmacSHA512(TEST_SECRET, hashData.toString());
        params.put("vnp_SecureHash", hash);

        // Tamper with amount
        params.put("vnp_Amount", "99999999");

        assertFalse(gateway.verifySecureHash(params), "Tampered data should fail verification");
    }

    @Test
    @DisplayName("verifySecureHash should return false when hash is missing")
    void verifySecureHash_missingHash() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Amount", "10000000");
        params.put("vnp_TxnRef", "TXN123");

        assertFalse(gateway.verifySecureHash(params), "Missing hash should fail verification");
    }

    @Test
    @DisplayName("verifySecureHash should return false for wrong hash")
    void verifySecureHash_wrongHash() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Amount", "10000000");
        params.put("vnp_TxnRef", "TXN123");
        params.put("vnp_SecureHash", "wronghashvalue123456");

        assertFalse(gateway.verifySecureHash(params), "Wrong hash should fail verification");
    }

    @Test
    @DisplayName("extractAmount should divide by 100")
    void extractAmount_dividesBy100() {
        Map<String, String> params = Map.of("vnp_Amount", "10000000");
        BigDecimal amount = gateway.extractAmount(params);
        assertEquals(0, BigDecimal.valueOf(100000).compareTo(amount), "10000000 / 100 = 100000");
    }

    @Test
    @DisplayName("extractAmount should return zero when param is missing")
    void extractAmount_missingParam() {
        Map<String, String> params = Map.of();
        assertEquals(BigDecimal.ZERO, gateway.extractAmount(params));
    }

    @Test
    @DisplayName("isSuccessResponse should return true only for code 00")
    void isSuccessResponse() {
        assertTrue(gateway.isSuccessResponse("00"));
        assertFalse(gateway.isSuccessResponse("01"));
        assertFalse(gateway.isSuccessResponse("24"));
        assertFalse(gateway.isSuccessResponse("99"));
        assertFalse(gateway.isSuccessResponse(null));
    }
}
