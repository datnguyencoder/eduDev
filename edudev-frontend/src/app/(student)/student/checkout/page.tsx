'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useCreateOrder, useCreateVnPayPayment } from '@/lib/query/hooks/usePayment';
import { ShoppingCart, CreditCard, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const comboId = searchParams.get('comboId');
  const comboName = searchParams.get('name') || 'Combo';
  const comboPrice = searchParams.get('price') || '0';

  const createOrder = useCreateOrder();
  const createPayment = useCreateVnPayPayment();
  const [step, setStep] = useState<'review' | 'processing' | 'error'>('review');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async () => {
    if (!comboId) return;
    setStep('processing');
    setErrorMsg('');

    try {
      // Step 1: Create order
      const order = await createOrder.mutateAsync(Number(comboId));

      // Step 2: Create VNPay payment URL
      const payment = await createPayment.mutateAsync(order.orderCode);

      // Step 3: Redirect to VNPay
      window.location.href = payment.paymentUrl;
    } catch (err: any) {
      setStep('error');
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
    }
  };

  if (!comboId) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <AlertCircle className="mx-auto text-amber-500" size={48} />
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy sản phẩm</h2>
        <p className="text-slate-500">Vui lòng chọn combo từ danh sách.</p>
        <Link href="/student/combos" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          <ArrowLeft size={16} /> Quay lại Combos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <Link href="/student/combos" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
          <ArrowLeft size={14} /> Quay lại
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Xác nhận Thanh toán</h1>
        <p className="text-sm text-slate-500 mt-1">Kiểm tra thông tin đơn hàng trước khi thanh toán</p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingCart size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800">{decodeURIComponent(comboName)}</h3>
            <p className="text-sm text-slate-500 mt-1">Combo khóa học</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Đơn giá</span>
            <span className="font-medium text-slate-800">{Number(comboPrice).toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Số lượng</span>
            <span className="font-medium text-slate-800">1</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Phương thức</span>
            <span className="font-medium text-slate-800">VNPay</span>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
          <span className="font-bold text-slate-800">Tổng cộng</span>
          <span className="text-2xl font-bold text-blue-600">{Number(comboPrice).toLocaleString('vi-VN')} ₫</span>
        </div>
      </div>

      {/* Error Message */}
      {step === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
          <div>
            <p className="text-sm font-medium text-red-800">Thanh toán thất bại</p>
            <p className="text-sm text-red-600 mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleCheckout}
        disabled={step === 'processing'}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
      >
        {step === 'processing' ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Thanh toán qua VNPay
          </>
        )}
      </button>

      <p className="text-xs text-center text-slate-400">
        Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
