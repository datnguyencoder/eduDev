'use client';

import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  BookMarked,
  ShieldCheck, 
  ArrowUpRight, 
  TrendingUp, 
  Activity,
  Plus,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAdminStats, useModerationQueue } from '@/lib/query/hooks/useAdmin';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { AdminStats, ModerationItem } from '@/lib/api/adminApi';
import type { ReactNode } from 'react';

const chartData = [
  { name: 'Thứ 2', users: 0 },
  { name: 'Thứ 3', users: 0 },
  { name: 'Thứ 4', users: 0 },
  { name: 'Thứ 5', users: 0 },
  { name: 'Thứ 6', users: 0 },
  { name: 'Thứ 7', users: 0 },
  { name: 'CN', users: 0 },
];

export default function AdminDashboardPage() {
  const { data: stats } = useAdminStats();
  const { data: queue } = useModerationQueue();

  const displayStats: AdminStats = stats || {
    totalStudents: 0,
    totalTeachers: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    totalEnrollments: 0,
    totalQuizAttempts: 0,
    pendingReviews: 0,
  };

  const displayQueue: ModerationItem[] = queue || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard label="Tổng học sinh" value={displayStats.totalStudents} trend="+12% tháng này" icon={<Users />} color="blue" />
        <AdminStatCard label="Giảng viên" value={displayStats.totalTeachers} trend="+2 tháng này" icon={<GraduationCap />} color="purple" />
        <AdminStatCard label="Nội dung" value={displayStats.totalLessons + displayStats.totalQuizzes} trend="+24 mục mới" icon={<BookOpen />} color="indigo" />
        <AdminStatCard label="Đang chờ duyệt" value={displayStats.pendingReviews} trend="Cần xử lý gấp" icon={<ShieldCheck />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Analytics Chart */}
         <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-xl font-bold text-slate-800">Lượt truy cập hệ thống</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">7 Ngày vừa qua</p>
               </div>
               <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100 italic">
                     <TrendingUp size={12} /> +15.5%
                  </div>
               </div>
            </div>

            <div className="h-[320px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                     />
                     <Area type="monotone" dataKey="users" stroke="#4f46e5" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Moderation Sidebar */}
         <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
               <h3 className="font-bold text-lg flex items-center gap-2 italic">
                  <ShieldCheck size={20} className="text-red-400" /> Chờ duyệt bài
               </h3>
               <Link href="/admin/moderation" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Tất cả</Link>
            </div>

            <div className="space-y-6">
               {displayQueue.map((item) => (
                  <div key={item.id ? `${item.type}-${item.id}` : `fallback-${item.title}`} className="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{item.type}</span>
                        <span className="text-[10px] text-slate-500 italic uppercase">{item.updatedAt}</span>
                     </div>
                     <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-white transition-colors mb-1">{item.title}</h4>
                     <p className="text-[10px] text-slate-400 font-medium">Bởi: {item.creatorName}</p>
                     
                     <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                        <button className="flex-1 py-1.5 bg-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-500 transition-all">DUYỆT</button>
                        <button className="flex-1 py-1.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg text-[10px] font-bold hover:bg-red-600/30 transition-all">TỪ CHỐI</button>
                     </div>
                  </div>
               ))}
            </div>

            <div className="pt-6 border-t border-white/10 italic">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <Activity size={14} className="text-emerald-500 animate-pulse" />
                  <span>Cập nhật 2 phút trước</span>
               </div>
            </div>
         </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <Users size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2 italic">Quản lý Tài khoản</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">Xét duyệt vai trò Giảng viên hoặc đình chỉ các tài khoản vi phạm chính sách.</p>
            <Link href="/admin/users" className="text-sm font-black text-indigo-600 flex items-center gap-2 group-hover:gap-3 transition-all">
               Truy cập Console <ArrowUpRight size={18} />
            </Link>
         </div>
         
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
               <BookMarked size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2 italic">Thư viện Ngành học</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">Cập nhật xu hướng thị trường, mã ngành và các gợi ý AI cho học sinh lớp 12.</p>
            <Link href="/admin/majors" className="text-sm font-black text-blue-600 flex items-center gap-2 group-hover:gap-3 transition-all">
               Quản lý CSDL <ArrowUpRight size={18} />
            </Link>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-slate-800 transition-all">
            <div className="w-12 h-12 bg-slate-50 text-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
               <Plus size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2 italic">Đăng Thông báo</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">Gửi thông báo toàn hệ thống về lịch bảo trì hoặc các tính năng AI mới được cập nhật.</p>
            <button className="text-sm font-black text-slate-900 flex items-center gap-2 group-hover:gap-3 transition-all">
               Soạn thảo <ArrowUpRight size={18} />
            </button>
         </div>
      </div>
    </div>
  );
}

function AdminStatCard({
  label,
  value,
  trend,
  icon,
  color,
}: {
  label: string;
  value: number;
  trend: string;
  icon: ReactNode;
  color: 'blue' | 'purple' | 'indigo' | 'red';
}) {
  const colors: Record<'blue' | 'purple' | 'indigo' | 'red', string> = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-indigo-50 text-indigo-600',
    indigo: 'bg-slate-50 text-slate-900',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", colors[color])}>
        {icon}
      </div>
      <div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{label}</p>
         <h4 className="text-3xl font-black text-slate-900 mb-2">{value.toLocaleString()}</h4>
         <p className={cn("text-[10px] font-bold uppercase tracking-widest", color === 'red' ? 'text-red-500' : 'text-emerald-600')}>{trend}</p>
      </div>
    </div>
  );
}
