'use client';

import { useMyPurchases, useMyOrders } from '@/lib/query/hooks/usePayment';
import { Package, Clock, CheckCircle2, XCircle, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  ACTIVE: { label: 'Đang truy cập', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle2 },
  INACTIVE: { label: 'Chưa kích hoạt', color: 'bg-slate-50 text-slate-500 border-slate-200', icon: Clock },
  EXPIRED: { label: 'Hết hạn', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: XCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-100', icon: XCircle },
};

export default function PurchasesPage() {
  const { data: purchases, isLoading, isError } = useMyPurchases();
  const { data: orders } = useMyOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Lịch sử Mua hàng</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý các combo đã mua và trạng thái truy cập</p>
      </div>

      {/* Purchases Grid */}
      {(!purchases || purchases.length === 0) ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="text-slate-400" size={28} />
          </div>
          <h3 className="font-bold text-slate-700">Chưa có giao dịch nào</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Khám phá các combo khóa học và bắt đầu hành trình học tập.</p>
          <Link href="/student/combos" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
            Xem Combos <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purchases.map((purchase) => {
            const config = statusConfig[purchase.accessStatus] || statusConfig.INACTIVE;
            const StatusIcon = config.icon;
            return (
              <div key={purchase.enrollmentId} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Package size={24} />
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${config.color}`}>
                    <StatusIcon size={12} />
                    {config.label}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-800 mb-1">{purchase.comboName}</h3>

                <div className="space-y-2 mt-4 text-sm">
                  {purchase.orderCode && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã đơn hàng</span>
                      <span className="font-mono text-slate-700">{purchase.orderCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Đã thanh toán</span>
                    <span className="font-medium text-slate-800">
                      {purchase.paidAmount > 0 ? `${purchase.paidAmount.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngày mua</span>
                    <span className="text-slate-700">{new Date(purchase.purchasedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                {purchase.accessStatus === 'ACTIVE' && (
                  <Link href="/student/combos" className="mt-4 w-full block text-center py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm rounded-xl transition-colors">
                    Tiếp tục Học →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Orders Table */}
      {orders && orders.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Đơn hàng gần đây</h2>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Mã đơn</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Số tiền</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Trạng thái</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-700">{order.orderCode}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{order.totalAmount.toLocaleString('vi-VN')} ₫</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        order.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === 'FAILED' ? 'bg-red-50 text-red-600' :
                        order.status === 'PENDING' || order.status === 'AWAITING_PAYMENT' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
