'use client';

import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  PlayCircle,
  Sparkles,
  Target,
  BrainCircuit,
  Loader2,
  CalendarDays,
  Flame    
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useCurrentUser } from '@/lib/query/hooks/useUser';
import { useSubjects } from '@/lib/query/hooks/useSubjects';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StudentDashboardPage() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: subjects, isLoading: isSubjectsLoading } = useSubjects();
  const [greeting, setGreeting] = useState('');

  // Handle client-side hydration for greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('buổi sáng');
    else if (hour < 14) setGreeting('buổi trưa');
    else if (hour < 18) setGreeting('buổi chiều');
    else setGreeting('buổi tối');
  }, []);

  const isLoading = isUserLoading || isSubjectsLoading;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
         <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
             <Trophy size={300} strokeWidth={1} />
         </div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100 mb-4 backdrop-blur-md">
                <Sparkles size={14} className="text-amber-300" /> Tóm tắt Học tập
            </div>
            
            {isLoading ? (
               <div className="space-y-3">
                  <div className="h-8 w-64 bg-white/20 rounded-lg animate-pulse" />
                  <div className="h-4 w-96 bg-white/10 rounded-lg animate-pulse" />
               </div>
            ) : (
                <>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                        Chào {greeting}, {user?.fullName?.split(' ').pop() || 'Học sinh'} 👋
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                        Khởi động lại tinh thần và tiếp tục chinh phục mục tiêu đại học của bạn. Hôm nay chúng ta có nhiều thông tin mới chờ phân tích.
                    </p>
                </>
            )}
            
            <div className="mt-8 flex flex-wrap gap-4 w-fit">
                <Link href="/student/subjects" className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-white/20 transition-all flex items-center gap-2 active:scale-95 text-sm">
                   Tiếp tục học <ArrowUpRight size={18} />
                </Link>
                <Link href="/student/recommendations" className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 active:scale-95 backdrop-blur-md text-sm">
                   Xem gợi ý AI <BrainCircuit size={18} />
                </Link>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<BookOpen size={22} />} 
            label="Môn học đang tham gia" 
            value={isLoading ? "..." : subjects?.length || "0"} 
            trend="Kết nối với dữ liệu thực" 
            color="blue" 
          />
          <StatCard 
            icon={<Trophy size={22} />} 
            label="Điểm trung bình (Dự kiến)" 
            value={isLoading ? "..." : "N/A"} 
            trend="Cần làm thêm đánh giá" 
            color="emerald" 
          />
          <StatCard 
            icon={<Flame size={22} />} 
            label="Chuỗi ngày học" 
            value={isLoading ? "..." : "1"} 
            trend="Cố gắng duy trì nhé" 
            color="amber" 
          />
          <StatCard 
            icon={<Target size={22} />} 
            label="Mục tiêu hoàn thành" 
            value={isLoading ? "..." : "0%"} 
            trend="Đang khởi tạo lộ trình AI" 
            color="indigo" 
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
                <h3 className="text-xl font-extrabold text-slate-800">Tiến độ Kiến thức thu nạp (Demo)</h3>
                <p className="text-sm font-medium text-slate-400 mt-1">Dữ liệu phân tích AI sẽ được gắn sau từ backend</p>
            </div>
            <select className="text-sm border-slate-200 bg-slate-50 font-medium rounded-xl px-4 py-2 text-slate-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
              <option>Tuần này</option>
              <option>Tháng này</option>
            </select>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
             <div className="w-16 h-16 bg-blue-100/50 flex flex-shrink-0 items-center justify-center rounded-2xl mb-4 text-blue-500">
                <LineChart size={28} />
             </div>
             <h4 className="text-slate-700 font-bold mb-1">Chưa có đủ dữ liệu biểu đồ</h4>
             <p className="text-sm text-slate-400 max-w-sm">Hoàn thành thêm các bài giảng và bộ câu hỏi trắc nghiệm để AI có thể phân tích tiến độ học tập hàng tuần của bạn.</p>
          </div>
        </div>

        {/* Subjects List */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-slate-800">Lộ trình Môn</h3>
              <Link href="/student/subjects" className="text-sm text-blue-600 hover:text-blue-700 font-bold transition-colors">Tất cả</Link>
           </div>
           <div className="space-y-3">
              {isLoading ? (
                 <div className="py-12 flex flex-col items-center gap-3 justify-center text-slate-400">
                     <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                     <p className="text-sm font-medium">Đang đồng bộ lộ trình...</p>
                 </div>
              ) : !subjects || subjects.length === 0 ? (
                 <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-sm font-medium">Chưa có môn học nào được đăng ký.</p>
                 </div>
              ) : subjects.slice(0, 4).map((sub: any) => (
                  <Link href={`/student/subjects/${sub.id}`} key={sub.id} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200">
                    <div className="relative w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                       {sub.thumbnailUrl ? (
                           <img src={sub.thumbnailUrl} alt={sub.name} className="w-full h-full object-cover" />
                       ) : (
                           <BookOpen size={20} className="group-hover:text-blue-500 transition-colors" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-slate-800 truncate leading-none mb-1">{sub.name}</h5>
                      <p className="text-xs font-medium text-slate-500 truncate">{sub.description || "Nội dung chuẩn"}</p>
                    </div>
                    <div className="text-slate-400">
                        <ArrowUpRight size={16} className="group-hover:text-blue-600 transition-colors" />
                    </div>
                  </Link>
              ))}
           </div>
        </div>
      </div>
      
      {/* Footer Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl overflow-hidden relative">
         <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4">
             <CalendarDays size={250} />
         </div>
         <div className="max-w-2xl relative z-10">
            <div className="inline-block px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase mb-4 tracking-widest">
               🎯 Kỳ thi đang tới
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Kỳ thi Đại học chỉ còn cách 3 tháng chuẩn bị!</h2>
            <p className="text-slate-300 font-medium leading-relaxed">
               Hệ thống AI sẽ sớm thu thập tất cả điểm trung bình của bạn và khoanh vùng ngành đại học khả thi dựa trên phổ điểm xét tuyển. Đừng quên cập nhật hồ sơ thường xuyên để có kết quả chính xác nhất.
            </p>
         </div>
         <Link href="/student/profile" className="bg-white hover:bg-slate-50 text-slate-900 border border-white/10 px-8 py-3.5 rounded-full font-bold text-sm shadow-xl hover:shadow-white/20 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap relative z-10">
             Cập nhật Hồ sơ <ArrowUpRight size={18} />
         </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  const bgIconMap: any = {
    blue: 'bg-blue-100/50',
    emerald: 'bg-emerald-100/50',
    amber: 'bg-amber-100/50',
    indigo: 'bg-indigo-100/50',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${colorMap[color]} group-hover:scale-110 transition-transform ${bgIconMap[color]}`}>
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="mt-2">
        <h4 className="text-3xl font-black text-slate-800">{value}</h4>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1.5">
         <TrendingUp size={14} className={color === 'blue' ? 'text-blue-500' : color === 'emerald' ? 'text-emerald-500' : color === 'amber' ? 'text-amber-500' : 'text-indigo-500'} />
         <p className="text-[11px] font-bold text-slate-400 capitalize tracking-tight">
           {trend}
         </p>
      </div>
    </div>
  );
}
