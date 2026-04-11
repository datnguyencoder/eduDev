'use client';

import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Star, 
  TrendingUp,
  ChevronRight,
  Sparkles,
  SearchX
} from 'lucide-react';
import { useMajors, useToggleWishlist } from '@/lib/query/hooks/useMajors';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MajorsPage() {
  const [search, setSearch] = useState('');
  const { data: majors, isLoading } = useMajors({ search });
  const { mutate: toggleWishlist } = useToggleWishlist();

  const displayMajors = majors || mockMajors;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Cẩm nang Ngành học</h1>
          <p className="text-slate-500 mt-2">Tìm hiểu chi tiết hàng trăm ngành nghề và cơ hội việc làm.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                 type="text" 
                 placeholder="Tìm theo tên hoặc mã ngành..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-[320px] shadow-sm"
              />
           </div>
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
              <span>Lọc khối thi</span>
           </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : displayMajors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
           <SearchX size={64} className="mb-4 opacity-20" />
           <p className="font-medium">Không tìm thấy ngành học nào phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMajors.map((major: any) => (
            <div key={major.id} className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
               <div>
                  <div className="flex justify-between items-start mb-6">
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded">Mã: {major.code}</span>
                     <button 
                       onClick={() => toggleWishlist(major.id)}
                       className="text-slate-300 hover:text-red-500 transition-colors"
                     >
                        <Star size={20} />
                     </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">{major.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                     {major?.admissionSubjects?.map((sub: string) => (
                        <span key={sub} className="text-[10px] font-bold text-slate-400 border border-slate-100 px-2 py-0.5 rounded italic">{sub}</span>
                     ))}
                  </div>
                  
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">
                    {major.description}
                  </p>
               </div>

               <div className="space-y-6 pt-6 border-t border-slate-50">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                           <TrendingUp size={16} />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Triển vọng</p>
                           <p className="text-xs font-bold text-emerald-600 truncate uppercase mt-1">Nhu cầu cao</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                           <Briefcase size={16} />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Lương khởi điểm</p>
                           <p className="text-xs font-bold text-slate-800 truncate mt-1">{major.salaryRange || '12-15Tr'}</p>
                        </div>
                     </div>
                  </div>

                  <Link 
                    href={`/student/majors/${major.id}`}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm"
                  >
                     Tìm hiểu sâu <ChevronRight size={18} />
                  </Link>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Section Mini Card */}
      <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
               <Sparkles size={28} />
            </div>
            <div>
               <h3 className="text-xl font-bold text-blue-900">Hãy để AI tìm giúp bạn!</h3>
               <p className="text-blue-700/70 text-sm">Khám phá các ngành học khớp nhất với lộ trình thi đại học của bạn.</p>
            </div>
         </div>
         <Link href="/student/recommendations" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.95]">
            Xem Gợi ý Cá nhân
         </Link>
      </div>
    </div>
  );
}

const mockMajors = [
  { id: '1', name: 'Khoa học Máy tính', code: '7480101', description: 'Nghiên cứu về máy tính, thuật toán, trí tuệ nhân tạo và xử lý dữ liệu quy mô lớn.', admissionSubjects: ['A00', 'A01', 'D07'], salaryRange: '15-25Tr' },
  { id: '2', name: 'Logistics và QL Chuỗi cung ứng', code: '7510605', description: 'Quản lý việc vận chuyển, lưu kho và phân phối hàng hóa trên phạm vi toàn cầu.', admissionSubjects: ['A00', 'D01', 'A01'], salaryRange: '12-18Tr' },
  { id: '3', name: 'Marketing kĩ thuật số', code: '7340115', description: 'Chiến lược truyền thông, quảng cáo và phân tích hành vi khách hàng trên nền tảng số.', admissionSubjects: ['D01', 'D07', 'D10'], salaryRange: '10-15Tr' },
  { id: '4', name: 'Ngôn ngữ Anh', code: '7220201', description: 'Thấu hiểu văn hóa, ngữ pháp và kỹ năng giao tiếp tiếng Anh chuyên nghiệp.', admissionSubjects: ['D01', 'D14', 'D15'], salaryRange: '12-20Tr' },
  { id: '5', name: 'Quản trị khách sạn', code: '7810201', description: 'Dịch vụ cao cấp, vận hành hệ thống khách sạn và du lịch quốc tế.', admissionSubjects: ['D01', 'A01', 'D07'], salaryRange: '10-18Tr' },
  { id: '6', name: 'Công nghệ thực phẩm', code: '7540101', description: 'Nghiên cứu quy trình chế biến, bảo quản và kiểm soát chất lượng thực phẩm.', admissionSubjects: ['A00', 'B00', 'D07'], salaryRange: '12-15Tr' },
];
