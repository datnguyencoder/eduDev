import { apiClient, getRequest, postRequest } from './apiClient';

// === Types ===
export interface OrderItem {
  id: number;
  itemType: string;
  itemId: number;
  itemNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderResponse {
  id: number;
  orderCode: string;
  totalAmount: number;
  currency: string;
  status: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: number;
  orderCode: string;
  totalAmount: number;
  currency: string;
  status: string;
  itemCount: number;
  createdAt: string;
}

export interface PaymentUrlResponse {
  paymentUrl: string;
  orderCode: string;
  txnRef: string;
}

export interface PaymentStatusResponse {
  orderCode: string;
  orderStatus: string;
  paymentStatus: string;
  amount: number;
  bankCode: string | null;
  responseCode: string | null;
  payDate: string | null;
  enrolled: boolean;
}

export interface PurchaseHistory {
  enrollmentId: number;
  comboId: number;
  comboName: string;
  comboThumbnailUrl: string | null;
  paidAmount: number;
  accessStatus: string;
  orderCode: string | null;
  purchasedAt: string;
}

// === API Calls ===
export const paymentApi = {
  createOrder: (comboId: number) =>
    postRequest<OrderResponse>('/student/orders', { comboId }),

  getMyOrders: () =>
    getRequest<OrderSummary[]>('/student/orders/me'),

  getOrderDetail: (orderCode: string) =>
    getRequest<OrderResponse>(`/student/orders/${orderCode}`),

  createVnPayPayment: (orderCode: string) =>
    postRequest<PaymentUrlResponse>('/student/payments/vnpay/create', { orderCode }),

  getPaymentStatus: (orderCode: string) =>
    getRequest<PaymentStatusResponse>(`/student/payments/orders/${orderCode}/status`),

  getMyPurchases: () =>
    getRequest<PurchaseHistory[]>('/student/purchases/me'),
};
