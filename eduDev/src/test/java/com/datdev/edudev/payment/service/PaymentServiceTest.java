package com.datdev.edudev.payment.service;

import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.combo.entity.Combo;
import com.datdev.edudev.combo.entity.Enrollment;
import com.datdev.edudev.combo.repository.ComboRepository;
import com.datdev.edudev.combo.repository.EnrollmentRepository;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.order.entity.Order;
import com.datdev.edudev.order.entity.OrderItem;
import com.datdev.edudev.order.entity.OrderStatus;
import com.datdev.edudev.order.entity.ItemType;
import com.datdev.edudev.order.repository.OrderRepository;
import com.datdev.edudev.order.service.OrderService;
import com.datdev.edudev.payment.entity.PaymentStatus;
import com.datdev.edudev.payment.entity.PaymentTransaction;
import com.datdev.edudev.payment.gateway.VnPayGateway;
import com.datdev.edudev.payment.repository.PaymentAuditLogRepository;
import com.datdev.edudev.payment.repository.PaymentTransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock private PaymentTransactionRepository paymentTransactionRepository;
    @Mock private PaymentAuditLogRepository auditLogRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private OrderService orderService;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private UserRepository userRepository;
    @Mock private ComboRepository comboRepository;
    @Mock private VnPayGateway vnPayGateway;

    @InjectMocks
    private PaymentService paymentService;

    private Order testOrder;
    private User testStudent;
    private Combo testCombo;
    private PaymentTransaction testTransaction;

    @BeforeEach
    void setUp() {
        // Replace the ObjectMapper mock with a real one
        // Since @InjectMocks cannot be used with mix of mock and real, we construct manually
        paymentService = new PaymentService(
                paymentTransactionRepository,
                auditLogRepository,
                orderRepository,
                orderService,
                enrollmentRepository,
                userRepository,
                comboRepository,
                vnPayGateway,
                new ObjectMapper()
        );

        testStudent = User.builder().id(1L).email("student@test.com").build();
        testCombo = Combo.builder().id(10L).name("Test Combo").build();

        testOrder = Order.builder()
                .id(100L)
                .orderCode("EDU-TEST1234")
                .student(testStudent)
                .totalAmount(BigDecimal.valueOf(200000))
                .status(OrderStatus.PENDING)
                .items(new ArrayList<>())
                .build();

        OrderItem item = OrderItem.builder()
                .id(1L)
                .order(testOrder)
                .itemType(ItemType.COMBO)
                .itemId(10L)
                .itemNameSnapshot("Test Combo")
                .unitPrice(BigDecimal.valueOf(200000))
                .quantity(1)
                .lineTotal(BigDecimal.valueOf(200000))
                .build();
        testOrder.getItems().add(item);

        testTransaction = PaymentTransaction.builder()
                .id(50L)
                .order(testOrder)
                .txnRef("EDU-TEST1234-123456")
                .amount(BigDecimal.valueOf(200000))
                .status(PaymentStatus.INITIATED)
                .build();
    }

    // ========== createVnPayPayment tests ==========

    @Test
    @DisplayName("createVnPayPayment should fail when order not found")
    void createVnPayPayment_orderNotFound() {
        when(orderRepository.findByOrderCode("FAKE")).thenReturn(Optional.empty());
        assertThrows(BusinessException.class,
                () -> paymentService.createVnPayPayment("FAKE", "127.0.0.1", 1L));
    }

    @Test
    @DisplayName("createVnPayPayment should fail when student does not own order")
    void createVnPayPayment_wrongStudent() {
        when(orderRepository.findByOrderCode("EDU-TEST1234")).thenReturn(Optional.of(testOrder));
        assertThrows(BusinessException.class,
                () -> paymentService.createVnPayPayment("EDU-TEST1234", "127.0.0.1", 999L));
    }

    @Test
    @DisplayName("createVnPayPayment should fail for already paid order")
    void createVnPayPayment_alreadyPaid() {
        testOrder.setStatus(OrderStatus.PAID);
        when(orderRepository.findByOrderCode("EDU-TEST1234")).thenReturn(Optional.of(testOrder));
        assertThrows(BusinessException.class,
                () -> paymentService.createVnPayPayment("EDU-TEST1234", "127.0.0.1", 1L));
    }

    // ========== handleIpnCallback tests ==========

    @Test
    @DisplayName("IPN should reject invalid signature")
    void handleIpn_invalidSignature() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TxnRef", "TXN123");
        params.put("vnp_ResponseCode", "00");
        params.put("vnp_Amount", "20000000");
        params.put("vnp_SecureHash", "invalidhash");

        when(vnPayGateway.verifySecureHash(params)).thenReturn(false);

        Map<String, String> response = paymentService.handleIpnCallback(params);
        assertEquals("97", response.get("RspCode"));
        assertEquals("Invalid Checksum", response.get("Message"));
    }

    @Test
    @DisplayName("IPN should return 01 when transaction not found")
    void handleIpn_transactionNotFound() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TxnRef", "NONEXISTENT");
        params.put("vnp_ResponseCode", "00");
        params.put("vnp_Amount", "20000000");

        when(vnPayGateway.verifySecureHash(params)).thenReturn(true);
        when(paymentTransactionRepository.findByTxnRef("NONEXISTENT")).thenReturn(Optional.empty());

        Map<String, String> response = paymentService.handleIpnCallback(params);
        assertEquals("01", response.get("RspCode"));
    }

    @Test
    @DisplayName("IPN should be idempotent for already successful transaction")
    void handleIpn_duplicateSuccess() {
        testTransaction.setStatus(PaymentStatus.SUCCESS);

        Map<String, String> params = new HashMap<>();
        params.put("vnp_TxnRef", testTransaction.getTxnRef());
        params.put("vnp_ResponseCode", "00");
        params.put("vnp_Amount", "20000000");

        when(vnPayGateway.verifySecureHash(params)).thenReturn(true);
        when(paymentTransactionRepository.findByTxnRef(testTransaction.getTxnRef()))
                .thenReturn(Optional.of(testTransaction));

        Map<String, String> response = paymentService.handleIpnCallback(params);
        assertEquals("02", response.get("RspCode"));
        assertEquals("Order already confirmed", response.get("Message"));

        // Verify no enrollment or order update calls were made
        verify(orderService, never()).markPaid(any());
        verify(enrollmentRepository, never()).save(any(Enrollment.class));
    }

    @Test
    @DisplayName("IPN should reject amount mismatch")
    void handleIpn_amountMismatch() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TxnRef", testTransaction.getTxnRef());
        params.put("vnp_ResponseCode", "00");
        params.put("vnp_Amount", "99999999"); // Wrong amount

        when(vnPayGateway.verifySecureHash(params)).thenReturn(true);
        when(paymentTransactionRepository.findByTxnRef(testTransaction.getTxnRef()))
                .thenReturn(Optional.of(testTransaction));
        when(vnPayGateway.extractAmount(params)).thenReturn(BigDecimal.valueOf(999999.99));

        Map<String, String> response = paymentService.handleIpnCallback(params);
        assertEquals("04", response.get("RspCode"));
        assertEquals("Invalid Amount", response.get("Message"));
    }

    @Test
    @DisplayName("IPN success should mark payment, order, and create enrollment")
    void handleIpn_successfulPayment() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TxnRef", testTransaction.getTxnRef());
        params.put("vnp_ResponseCode", "00");
        params.put("vnp_Amount", "20000000");
        params.put("vnp_TransactionNo", "VNP123");
        params.put("vnp_BankCode", "NCB");
        params.put("vnp_PayDate", "20260413153000");

        when(vnPayGateway.verifySecureHash(params)).thenReturn(true);
        when(paymentTransactionRepository.findByTxnRef(testTransaction.getTxnRef()))
                .thenReturn(Optional.of(testTransaction));
        when(vnPayGateway.extractAmount(params)).thenReturn(BigDecimal.valueOf(200000));
        when(vnPayGateway.isSuccessResponse("00")).thenReturn(true);
        when(enrollmentRepository.existsByUserIdAndComboId(1L, 10L)).thenReturn(false);
        when(comboRepository.findById(10L)).thenReturn(Optional.of(testCombo));
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(inv -> inv.getArgument(0));
        when(paymentTransactionRepository.save(any(PaymentTransaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Map<String, String> response = paymentService.handleIpnCallback(params);

        assertEquals("00", response.get("RspCode"));
        assertEquals("Confirm Success", response.get("Message"));

        // Verify payment marked as SUCCESS
        assertEquals(PaymentStatus.SUCCESS, testTransaction.getStatus());

        // Verify order marked as PAID
        verify(orderService).markPaid("EDU-TEST1234");

        // Verify enrollment created
        verify(enrollmentRepository).save(any(Enrollment.class));
    }

    @Test
    @DisplayName("IPN failure should mark payment and order as FAILED")
    void handleIpn_failedPayment() {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TxnRef", testTransaction.getTxnRef());
        params.put("vnp_ResponseCode", "24"); // User cancelled
        params.put("vnp_Amount", "20000000");

        when(vnPayGateway.verifySecureHash(params)).thenReturn(true);
        when(paymentTransactionRepository.findByTxnRef(testTransaction.getTxnRef()))
                .thenReturn(Optional.of(testTransaction));
        when(vnPayGateway.extractAmount(params)).thenReturn(BigDecimal.valueOf(200000));
        when(vnPayGateway.isSuccessResponse("24")).thenReturn(false);
        when(paymentTransactionRepository.save(any(PaymentTransaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Map<String, String> response = paymentService.handleIpnCallback(params);

        assertEquals("00", response.get("RspCode")); // VNPay always expects 00 for acknowledge
        assertEquals(PaymentStatus.FAILED, testTransaction.getStatus());
        verify(orderService).markFailed("EDU-TEST1234");
        verify(enrollmentRepository, never()).save(any(Enrollment.class));
    }
}
