'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { usePaymentStatus } from '@/lib/query/hooks/usePayment';
import { CheckCircle2, XCircle, Clock, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode') || '';
  const vnpResponseCode = searchParams.get('vnp_ResponseCode') || '';

  const { data: status, isLoading, isError } = usePaymentStatus(orderCode, !!orderCode);

  if (!orderCode) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <XCircle className="mx-auto text-red-400" size={48} />
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy đơn hàng</h2>
        <Link href="/student/combos" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          <ArrowLeft size={16} /> Quay lại Combos
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
        <Loader2 className="mx-auto text-blue-600 animate-spin" size={48} />
        <h2 className="text-xl font-bold text-slate-800">Đang xác minh thanh toán...</h2>
        <p className="text-sm text-slate-500">Vui lòng đợi trong giây lát</p>
      </div>
    );
  }

  const isSuccess = status?.paymentStatus === 'SUCCESS' || status?.enrolled;
  const isFailed = status?.paymentStatus === 'FAILED' || (vnpResponseCode && vnpResponseCode !== '00' && !isSuccess);
  const isPending = !isSuccess && !isFailed;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-6">
        {/* Status Icon */}
        {isSuccess && (
          <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-emerald-500" size={40} />
          </div>
        )}
        {isFailed && (
          <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <XCircle className="text-red-500" size={40} />
          </div>
        )}
        {isPending && (
          <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
            <Clock className="text-amber-500 animate-pulse" size={40} />
          </div>
        )}

        {/* Status Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isSuccess && 'Thanh toán thành công! 🎉'}
            {isFailed && 'Thanh toán thất bại'}
            {isPending && 'Đang chờ xác nhận...'}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {isSuccess && 'Bạn đã mở khóa combo thành công. Bắt đầu học ngay!'}
            {isFailed && 'Giao dịch không thành công. Bạn có thể thử lại.'}
            {isPending && 'Hệ thống đang xử lý giao dịch của bạn. Vui lòng chờ...'}
          </p>
        </div>

        {/* Order Details */}
        {status && (
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Mã đơn hàng</span>
              <span className="font-mono font-medium text-slate-800">{status.orderCode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Số tiền</span>
              <span className="font-medium text-slate-800">{status.amount?.toLocaleString('vi-VN')} ₫</span>
            </div>
            {status.bankCode && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ngân hàng</span>
                <span className="font-medium text-slate-800">{status.bankCode}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Trạng thái</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                isSuccess ? 'bg-emerald-50 text-emerald-600' :
                isFailed ? 'bg-red-50 text-red-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                <ShieldCheck size={12} />
                {isSuccess ? 'Thành công' : isFailed ? 'Thất bại' : 'Đang xử lý'}
              </span>
            </div>
            {status.payDate && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Thời gian</span>
                <span className="font-medium text-slate-800">
                  {new Date(status.payDate).toLocaleString('vi-VN')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {isSuccess && (
            <Link href="/student/combos" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-center">
              Bắt đầu Học
            </Link>
          )}
          {isFailed && (
            <Link href="/student/combos" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-center">
              Thử lại
            </Link>
          )}
          <Link href="/student/purchases" className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors text-center">
            Lịch sử mua
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
