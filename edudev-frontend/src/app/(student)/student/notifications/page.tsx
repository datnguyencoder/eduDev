'use client';

import { 
  Bell, 
  CheckCheck, 
  Info, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Star,
  Zap,
  ChevronRight,
  Filter,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NotificationListPage() {
  const [activeTab, setActiveTab] = useState('ALL');

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 italic">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Bell size={32} className="text-indigo-600" />
             Trung tâm Thông báo
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Theo dõi mọi cập nhật về bài giảng, phản hồi và sự kiện hệ thống.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
              <CheckCheck size={18} /> Đánh dấu đã đọc
           </button>
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-all">
              <Trash2 size={18} />
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-50 pb-4 italic">
         <button onClick={() => setActiveTab('ALL')} className={cn("text-sm font-black transition-all pb-4 relative", activeTab === 'ALL' ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600")}>Tất cả (24)</button>
         <button onClick={() => setActiveTab('SYSTEM')} className={cn("text-sm font-black transition-all pb-4 relative", activeTab === 'SYSTEM' ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600")}>Hệ thống (4)</button>
         <button onClick={() => setActiveTab('LEARNING')} className={cn("text-sm font-black transition-all pb-4 relative", activeTab === 'LEARNING' ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600")}>Học tập (18)</button>
         <button onClick={() => setActiveTab('SOCIAL')} className={cn("text-sm font-black transition-all pb-4 relative", activeTab === 'SOCIAL' ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600")}>Hoạt động (2)</button>
      </div>

      <div className="space-y-4">
         {[1, 2, 3, 4, 5].map((i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className={cn(
                  "group bg-white p-6 rounded-3xl border transition-all flex items-start gap-6 cursor-pointer",
                  i === 1 ? "border-indigo-200 ring-4 ring-indigo-50 shadow-sm" : "border-slate-200 hover:border-slate-300"
               )}
            >
               <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all",
                  i % 2 === 0 ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
               )}>
                  {i % 2 === 0 ? <MessageSquare size={20} /> : <Zap size={20} />}
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{i % 2 === 0 ? 'HỌC TẬP' : 'HỆ THỐNG'}</span>
                     <span className="text-[10px] text-slate-400 font-bold italic">{i * 2} giờ trước</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors">
                     {i % 2 === 0 ? 'Bài học "Hàm số logarit" của Thầy An vừa có cập nhật mới về bài tập ví dụ.' : 'Hệ thống chuẩn bị bảo trì nâng cấp Core AI vào lúc 23:00 hôm nay.'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
                     Chi tiết thông báo <ChevronRight size={14} />
                  </p>
               </div>
               
               {i === 1 && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
               )}
            </motion.div>
         ))}
      </div>

      {/* Pagination Footer Placeholder */}
      <div className="flex items-center justify-center py-10 opacity-50 italic">
         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đã hiển thị 48/412 thông báo</p>
      </div>
    </div>
  );
}
