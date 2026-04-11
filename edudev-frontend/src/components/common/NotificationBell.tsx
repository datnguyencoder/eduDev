'use client';

import { useState } from 'react';
import { Bell, CheckCheck, Info, MessageSquare, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative italic">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative group"
      >
        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-4 w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Thông báo</h4>
               <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                  <CheckCheck size={12} /> Đã đọc tất cả
               </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto px-4 py-2 custom-scrollbar">
               {[1, 2, 3, 4].map(i => (
                  <div key={i} className="group p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer">
                     <div className="flex gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border", 
                           i % 2 === 0 ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                        )}>
                           {i % 2 === 0 ? <MessageSquare size={16} /> : <Info size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-slate-800 leading-snug mb-1">
                              {i % 2 === 0 ? 'Thầy Nguyễn An vừa phản hồi bài giải của bạn.' : 'Môn Toán học 12 vừa cập nhật 2 bài giảng mới.'}
                           </p>
                           <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <Clock size={12} />
                              <span>{i * 15} phút trước</span>
                           </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  </div>
               ))}
            </div>

            <div className="p-4 bg-slate-50/50 text-center border-t border-slate-50">
               <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                  Xem tất cả thông báo
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
