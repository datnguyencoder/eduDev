package com.datdev.edudev.payment.controller;

import com.datdev.edudev.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/v1/public/payments/vnpay")
@Tag(name = "VNPay Callbacks", description = "Public VNPay callback endpoints (no JWT required)")
@SecurityRequirements // explicitly marks these as no-auth in Swagger
public class VnPayCallbackController {

    private static final Logger log = LoggerFactory.getLogger(VnPayCallbackController.class);

    private final PaymentService paymentService;

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    public VnPayCallbackController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * VNPay IPN (Instant Payment Notification) endpoint.
     * This is the source of truth for payment status.
     * Must return JSON {RspCode, Message} as VNPay expects.
     */
    @GetMapping("/ipn")
    @Operation(summary = "VNPay IPN callback (server-to-server, no JWT)")
    public ResponseEntity<Map<String, String>> handleIpn(@RequestParam Map<String, String> params) {
        log.info("VNPay IPN callback received with {} params", params.size());
        Map<String, String> response = paymentService.handleIpnCallback(params);
        return ResponseEntity.ok(response);
    }

    /**
     * VNPay return URL. Redirects user back to frontend payment result page.
     * This is NOT the source of truth — only for UI flow.
     */
    @GetMapping("/return")
    @Operation(summary = "VNPay return URL (redirects to frontend)")
    public ResponseEntity<Void> handleReturn(@RequestParam Map<String, String> params) {
        log.info("VNPay return callback received");
        paymentService.handleReturnCallback(params);

        String txnRef = params.getOrDefault("vnp_TxnRef", "");
        String responseCode = params.getOrDefault("vnp_ResponseCode", "");

        // Extract order code from txnRef (format: EDU-XXXXXXXX-timestamp)
        String orderCode = txnRef.contains("-") ?
                txnRef.substring(0, txnRef.lastIndexOf("-")) : txnRef;

        String redirectUrl = frontendBaseUrl + "/student/payment/result"
                + "?orderCode=" + orderCode
                + "&vnp_ResponseCode=" + responseCode;

        return ResponseEntity.status(302).location(URI.create(redirectUrl)).build();
    }
}
