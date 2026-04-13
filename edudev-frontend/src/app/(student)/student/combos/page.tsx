'use client';

import { useQuery } from '@tanstack/react-query';
import { getRequest } from '@/lib/api/apiClient';
import { useMyPurchases } from '@/lib/query/hooks/usePayment';
import { BookMarked, Lock, PlayCircle, GraduationCap, ShoppingCart, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ComboSummary {
  id: number;
  name: string;
  description: string;
  thumbnailUrl: string | null;
  price: number;
  status: string;
  itemCount: number;
}

export default function StudentCombosPage() {
  const { data: combos, isLoading } = useQuery({
    queryKey: ['publishedCombos'],
    queryFn: () => getRequest<ComboSummary[]>('/combos'),
  });

  const { data: purchases } = useMyPurchases();

  const purchasedComboIds = new Set(purchases?.map(p => p.comboId) || []);

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
        <h1 className="text-2xl font-bold text-slate-800">Combo Khóa học</h1>
        <p className="text-sm text-slate-500 mt-1">Khám phá và đăng ký các gói combo phù hợp với bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos?.map((combo) => {
          const isPurchased = purchasedComboIds.has(combo.id);
          const isFree = !combo.price || combo.price === 0;

          return (
            <div key={combo.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <BookMarked size={24} />
                </div>
                {isPurchased ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">
                    <CheckCircle2 size={12} /> Đã mua
                  </span>
                ) : isFree ? (
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
                    Miễn phí
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg border border-amber-100">
                    {combo.price.toLocaleString('vi-VN')} ₫
                  </span>
                )}
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-2">{combo.name}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">
                {combo.description || `Tuyển tập lộ trình hoàn chỉnh gồm ${combo.itemCount} nội dung.`}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <GraduationCap size={14} />
                  <span>{combo.itemCount} nội dung</span>
                </div>

                {isPurchased ? (
                  <Link href="/student/combos" className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700">
                    Tiếp tục <PlayCircle size={16} />
                  </Link>
                ) : isFree ? (
                  <Link href="/student/combos" className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700">
                    Đăng ký <PlayCircle size={16} />
                  </Link>
                ) : (
                  <Link
                    href={`/student/checkout?comboId=${combo.id}&name=${encodeURIComponent(combo.name)}&price=${combo.price}`}
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    Mua <ShoppingCart size={16} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {/* Explore Card */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer min-h-[280px]">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-4">
            <Lock size={20} />
          </div>
          <h3 className="font-bold text-slate-700 mb-1">Khám phá Combo mới</h3>
          <p className="text-sm text-slate-500 mb-4 px-4">Tìm lộ trình mới do AI EduDev gợi ý.</p>
          <Link href="/student/recommendations" className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:text-blue-600 transition-colors">
            Xem Gợi ý
          </Link>
        </div>
      </div>
    </div>
  );
}