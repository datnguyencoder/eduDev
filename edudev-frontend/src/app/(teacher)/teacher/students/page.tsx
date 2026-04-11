'use client';

import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Zap,
  Clock
} from 'lucide-react';
import { useAssignedStudents } from '@/lib/query/hooks/useTeacher';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function StudentMonitorPage() {
  const { data: students, isLoading } = useAssignedStudents();
  const [search, setSearch] = useState('');

  const displayStudents = students || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <UserCheck size={32} className="text-indigo-600" />
             Quản lý Học sinh
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">Theo dõi lộ trình học tập và hỗ trợ kịp thời cho học sinh của bạn.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                 type="text" 
                 placeholder="Tìm học sinh..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-[320px] shadow-sm font-bold"
              />
           </div>
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
              <span>Tiến độ</span>
           </button>
        </div>
      </div>

      {/* Engagement Overview Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-white/10 rounded-2xl"><Zap size={20} /></div>
               <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Hoạt động</span>
            </div>
            <div className="space-y-1">
               <h4 className="text-3xl font-black">12</h4>
               <p className="text-xs text-indigo-100/70 font-bold uppercase tracking-widest leading-none">Học sinh tích cực (Hôm nay)</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={20} /></div>
               <span className="text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100">Cần lưu ý</span>
            </div>
            <div className="space-y-1">
               <h4 className="text-3xl font-black text-slate-800">03</h4>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none italic">Sụt giảm phong độ học tập</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 size={20} /></div>
               <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">Đã xong lộ trình</span>
            </div>
            <div className="space-y-1">
               <h4 className="text-3xl font-black text-slate-800">45</h4>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none italic uppercase">Học sinh hoàn thành môn</p>
            </div>
         </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
         <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
               <tr>
                  <th className="px-8 py-5">Học sinh</th>
                  <th className="px-8 py-5">Lộ trình đang theo</th>
                  <th className="px-8 py-5">Tiến độ (%)</th>
                  <th className="px-8 py-5">Hoạt động cuối</th>
                  <th className="px-8 py-5"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 italic">
               {displayStudents.map((student: any) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase border border-indigo-100">
                              {student.fullName.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-800 leading-none mb-1">{student.fullName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Lớp {student.grade}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{student.targetMajor || 'Khoa học Máy tính'}</span>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4 max-w-[140px]">
                           <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${student.progress}%` }} />
                           </div>
                           <span className="text-xs font-black text-slate-800">{student.progress}%</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-slate-700">{student.lastActive}</span>
                           <span className="text-[10px] text-slate-400 italic font-medium uppercase mt-1 tracking-tighter">Qua APP Mobile</span>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Gửi tin nhắn">
                              <MessageSquare size={18} />
                           </button>
                           <button className="p-2 text-slate-400 hover:text-slate-800 rounded-lg transition-colors">
                              <ChevronRight size={18} />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}


