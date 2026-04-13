import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '@/lib/api/paymentApi';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comboId: number) => paymentApi.createOrder(comboId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['myOrders'],
    queryFn: () => paymentApi.getMyOrders(),
  });
}

export function useOrderDetail(orderCode: string) {
  return useQuery({
    queryKey: ['order', orderCode],
    queryFn: () => paymentApi.getOrderDetail(orderCode),
    enabled: !!orderCode,
  });
}

export function useCreateVnPayPayment() {
  return useMutation({
    mutationFn: (orderCode: string) => paymentApi.createVnPayPayment(orderCode),
  });
}

export function usePaymentStatus(orderCode: string, enabled = true) {
  return useQuery({
    queryKey: ['paymentStatus', orderCode],
    queryFn: () => paymentApi.getPaymentStatus(orderCode),
    enabled: !!orderCode && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling once we have a final state
      if (data && (data.paymentStatus === 'SUCCESS' || data.paymentStatus === 'FAILED' || data.enrolled)) {
        return false;
      }
      return 3000; // Poll every 3 seconds while pending
    },
  });
}

export function useMyPurchases() {
  return useQuery({
    queryKey: ['myPurchases'],
    queryFn: () => paymentApi.getMyPurchases(),
  });
}
