'use client';

import { 
  FileEdit, 
  PlusSquare, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MoreVertical,
  Layers,
  Search
} from 'lucide-react';
import { useTeacherStats, useManagedContent } from '@/lib/query/hooks/useTeacher';
import { cn } from '@/lib/utils';
import Link from 'next/navigation';

export default function TeacherDashboardPage() {
  const { data: stats, isLoading: isStatsLoading } = useTeacherStats();
  const { data: recentContent, isLoading: isContentLoading } = useManagedContent();

  const displayStats = stats || {
    totalLessons: 24,
    totalQuizzes: 12,
    totalCombos: 5,
    activeStudents: 156,
    pendingReviews: 3
  };

  const displayContent = recentContent || [
    { id: '1', title: 'Đạo hàm bậc cao và ứng dụng', type: 'LESSON', status: 'APPROVED', updatedAt: '2024-03-10' },
    { id: '2', title: 'Quiz trắc nghiệm Chương 1', type: 'QUIZ', status: 'PENDING', updatedAt: '2024-03-11' },
    { id: '3', title: 'Combo Luyện thi khối A cấp tốc', type: 'COMBO', status: 'DRAFT', updatedAt: '2024-03-12' },
    { id: '4', title: 'Sóng dừng và giao thoa', type: 'LESSON', status: 'REJECTED', updatedAt: '2024-03-09' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Khu vực Giảng viên</h1>
          <p className="text-slate-500 mt-2 font-medium italic">Chào mừng trở lại! Hãy tiếp tục chia sẻ kiến thức hữu ích.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95">
              <FileEdit size={18} /> Soạn bài mới
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95">
              <PlusSquare size={18} /> Tạo Quiz
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TeacherStatCard label="Bài học" value={displayStats.totalLessons} icon={<FileEdit />} color="indigo" />
        <TeacherStatCard label="Học sinh quản lý" value={displayStats.activeStudents} icon={<Users />} color="emerald" />
        <TeacherStatCard label="Đang chờ duyệt" value={displayStats.pendingReviews} icon={<Clock />} color="amber" />
        <TeacherStatCard label="Tỷ lệ chấp thuận" value="92%" icon={<TrendingUp />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Content Table */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Nội dung vừa biên soạn</h3>
              <button className="text-sm font-bold text-indigo-600 hover:underline">Xem tất cả</button>
           </div>
           
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                 <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                       <th className="px-6 py-4">Tên nội dung</th>
                       <th className="px-6 py-4">Loại</th>
                       <th className="px-6 py-4">Trạng thái</th>
                       <th className="px-6 py-4">Ngày cập nhật</th>
                       <th className="px-6 py-4"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 italic">
                    {displayContent.map((item: any) => (
                       <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800 text-sm">{item.title}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                                {item.type === 'LESSON' ? <FileEdit size={12} /> : item.type === 'QUIZ' ? <PlusSquare size={12} /> : <Layers size={12} />}
                                {item.type}
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <StatusBadge status={item.status} />
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-400">{item.updatedAt}</td>
                          <td className="px-6 py-4 text-right">
                             <button className="p-2 text-slate-400 hover:text-slate-600">
                                <MoreVertical size={18} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Side Actions / Insights */}
        <div className="space-y-8">
           <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="text-indigo-300 font-bold uppercase tracking-widest text-[10px] mb-4">Gợi ý chủ đề</h4>
                 <h3 className="text-xl font-black mb-6 leading-snug">Học sinh đang tìm kiếm nhiều về "Logarit và Số phức"</h3>
                 <p className="text-indigo-100/70 text-sm mb-8">Hãy bổ sung bài giảng mới về chủ đề này để tăng lượng tương tác.</p>
                 <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all">
                    Soạn ngay chủ đề này <ArrowRight size={18} />
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-[80px] opacity-20" />
           </div>

           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <Users size={20} className="text-indigo-600" />
                 Học sinh tiêu biểu
              </h3>
              <div className="space-y-6">
                 {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs uppercase italic">HS</div>
                          <div>
                             <p className="text-sm font-bold text-slate-800 leading-none mb-1">Học sinh {i}</p>
                             <p className="text-[10px] text-slate-400 font-bold">Hoàn thành 85%</p>
                          </div>
                       </div>
                       <div className="text-indigo-600">
                          <ArrowRight size={14} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TeacherStatCard({ label, value, icon, color }: any) {
  const colors: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 border", colors[color])}>
        {icon}
      </div>
      <div>
         <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-2xl font-black text-slate-800">{value}</h4>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    APPROVED: { label: 'Đã duyệt', class: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    PENDING: { label: 'Chờ duyệt', class: 'bg-amber-50 text-amber-600 border-amber-100' },
    DRAFT: { label: 'Bản nháp', class: 'bg-slate-50 text-slate-400 border-slate-100' },
    REJECTED: { label: 'Cần sửa', class: 'bg-red-50 text-red-600 border-red-100' },
  };

  const config = configs[status];

  return (
    <div className={cn("inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border", config.class)}>
       {config.label}
    </div>
  );
}
