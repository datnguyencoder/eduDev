'use client';

import { 
  MessageSquare, 
  Star, 
  Search, 
  Filter, 
  ThumbsUp, 
  ArrowRight,
  User,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState('ALL');

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 italic">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Phản hồi & Đánh giá</h1>
          <p className="text-slate-500 mt-2 font-medium">Lắng nghe ý kiến của học sinh để hoàn thiện nội dung giảng dạy.</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-center bg-white p-4 rounded-2xl border border-slate-200 min-w-[120px]">
              <p className="text-2xl font-black text-indigo-600">4.8</p>
              <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
                 {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= 4 ? "currentColor" : "none"} />)}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Trung bình</p>
           </div>
           <div className="text-center bg-indigo-600 p-4 rounded-2xl text-white min-w-[120px] shadow-xl shadow-indigo-500/20">
              <p className="text-2xl font-black">124</p>
              <div className="flex items-center justify-center gap-1 my-1">
                 <MessageSquare size={12} />
              </div>
              <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest italic">Tổng đánh giá</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* Filter Sidebar */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Lọc theo sao</h3>
               <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(star => (
                     <button 
                       key={star}
                       className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-600"
                     >
                        <div className="flex items-center gap-2">
                           <div className="flex gap-0.5 text-amber-500">
                              {[...Array(star)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                           </div>
                           <span className="text-xs">{star} Sao</span>
                        </div>
                        <span className="text-[10px] text-slate-300">({star * 12})</span>
                     </button>
                  ))}
               </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Nội dung đánh giá</h3>
               <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Bài học TOP</p>
                     <p className="text-sm font-bold text-slate-800 leading-tight">Cực trị của hàm số</p>
                     <div className="mt-3 flex items-center justify-between text-[10px]">
                        <span className="font-black text-emerald-600">45 Bình luận</span>
                        <span className="text-slate-400 italic">Hôm qua</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Feedback List */}
         <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
               <div className="flex gap-8">
                  <button onClick={() => setActiveTab('ALL')} className={cn("text-sm font-black transition-all pb-4 relative", activeTab === 'ALL' ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600")}>TẤT CẢ (124)</button>
                  <button onClick={() => setActiveTab('UNREAD')} className={cn("text-sm font-black transition-all pb-4 relative", activeTab === 'UNREAD' ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600")}>CHƯA TRẢ LỜI (12)</button>
               </div>
               <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Tìm tên, nội dung..." className="pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs w-[240px]" />
               </div>
            </div>

            <div className="space-y-6">
               {[1, 2, 3].map(i => (
                  <FeedbackCard key={i} />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function FeedbackCard() {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group">
       <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 font-black text-xs">A</div>
             <div>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                   <h4 className="text-sm font-black text-slate-800">Nguyễn Thế Minh</h4>
                   <div className="flex gap-1 text-amber-500">
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                   </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Đánh giá bài học: <span className="text-indigo-600">Nguyên hàm cơ bản</span></p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium opacity-90 italic">
                   "Bài giảng rất chi tiết và dễ hiểu ạ. Thầy có thể cho thêm nhiều bài tập áp dụng về phần tích phân từng phần không ạ? Em cảm ơn thầy nhiều."
                </p>
                
                <div className="mt-6 flex items-center gap-6">
                   <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                      <MessageSquare size={14} /> Trả lời ngay
                   </button>
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-all flex items-center gap-2">
                      <ThumbsUp size={14} /> Ghi nhận (Like)
                   </button>
                   <span className="ml-auto text-[10px] text-slate-300 font-medium">15/03/2024 • 10:45</span>
                </div>
             </div>
          </div>
          <button className="p-2 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
             <AlertCircle size={18} />
          </button>
       </div>
    </div>
  );
}
