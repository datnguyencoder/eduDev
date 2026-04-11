'use client';

import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  User, 
  CheckCircle, 
  XSquare, 
  ArrowRight,
  FileEdit,
  PlusSquare,
  Layers,
  Info,
  ExternalLink
} from 'lucide-react';
import { useModerationQueue, useApproveContent } from '@/lib/query/hooks/useAdmin';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { message, Modal } from 'antd';
import type { ModerationItem } from '@/lib/api/adminApi';

export default function ModerationPage() {
  const { data: queue, isLoading } = useModerationQueue();
  const { mutate: approve } = useApproveContent();
  const [filterType, setFilterType] = useState('ALL');

  const handleApprove = (type: ModerationItem['type'], id: string) => {
    approve({ type, id }, {
       onSuccess: () => message.success('Nội dung đã được duyệt công khai'),
    });
  };

  const displayQueue = queue || mockQueue;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 italic">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <ShieldCheck size={32} className="text-emerald-500" />
             Duyệt Nội dung
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Kiểm soát chất lượng bài giảng, quiz và combo từ giảng viên.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                 type="text" 
                 placeholder="Tìm tiêu đề..." 
                 className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-[240px] shadow-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
              />
           </div>
           <select 
             onChange={(e) => setFilterType(e.target.value)}
             className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
           >
              <option value="ALL">Tất cả loại</option>
              <option value="LESSON">Bài giảng</option>
              <option value="QUIZ">Quiz</option>
              <option value="COMBO">Combo</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 border-l-4 border-emerald-500">Đang chờ xử lý ({displayQueue.length})</h3>
            
            <div className="space-y-4">
               {displayQueue.map((item: any) => (
                  <ModerationCard 
                    key={item.id} 
                    item={item} 
                    onApprove={() => handleApprove(item.type, item.id)}
                  />
               ))}
            </div>
         </div>

         {/* Review Guidelines */}
         <div className="space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
               <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Info size={18} /> Tiêu chuẩn nội dung
               </h3>
               <ul className="space-y-6">
                  <li className="flex gap-4">
                     <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-black italic">1</div>
                     <div className="space-y-1">
                        <p className="text-xs font-bold leading-none">Tính chính xác</p>
                        <p className="text-[10px] text-slate-400 font-medium italic">Thông tin khoa học, số liệu phải chuẩn xác.</p>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-black italic">2</div>
                     <div className="space-y-1">
                        <p className="text-xs font-bold leading-none">Trình bày chuyên nghiệp</p>
                        <p className="text-[10px] text-slate-400 font-medium italic">Không lỗi chính tả, bố cục rõ ràng.</p>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-black italic">3</div>
                     <div className="space-y-1">
                        <p className="text-xs font-bold leading-none">Bản quyền</p>
                        <p className="text-[10px] text-slate-400 font-medium italic">Nghiêm cấm sao chép nội dung trái phép.</p>
                     </div>
                  </li>
               </ul>
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 rounded-full blur-[80px] opacity-10" />
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center italic">
               <h4 className="text-sm font-bold text-slate-800 mb-2 font-black uppercase tracking-widest leading-none">Báo cáo kiểm duyệt</h4>
               <p className="text-[10px] text-slate-400 mb-6">Tháng này đã duyệt 242 bài giảng, 56 combo.</p>
               <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto">
                  Xem báo cáo chi tiết <ArrowRight size={14} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function ModerationCard({ item, onApprove }: any) {
  return (
    <div className="group bg-white p-8 rounded-3xl border border-slate-200 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
       <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className={cn(
             "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all group-hover:scale-110",
             item.type === 'LESSON' ? "bg-indigo-50 border-indigo-100 text-indigo-600" :
             item.type === 'QUIZ' ? "bg-amber-50 border-amber-100 text-amber-600" :
             "bg-emerald-50 border-emerald-100 text-emerald-600"
          )}>
             {item.type === 'LESSON' ? <FileEdit size={24} /> : item.type === 'QUIZ' ? <PlusSquare size={24} /> : <Layers size={24} />}
          </div>

          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{item.type} • ID: {item.id}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 italic">
                   <Clock size={12} /> {item.createdAt}
                </span>
             </div>
             <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors mb-3">{item.title}</h4>
             <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold uppercase">{item.authorName.charAt(0)}</div>
                <span className="text-sm font-bold text-slate-500">Người soạn: <span className="text-slate-800">{item.authorName}</span></span>
             </div>
             
             <div className="flex flex-wrap gap-3">
                <button 
                  onClick={onApprove}
                  className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
                >
                   <CheckCircle size={18} /> Chấp thuận
                </button>
                <button className="px-6 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-all flex items-center gap-2 italic">
                   <XSquare size={18} /> Từ chối
                </button>
                <button className="px-4 py-2.5 bg-slate-50 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-100 hover:text-slate-800 transition-all flex items-center gap-2 ml-auto">
                   <ExternalLink size={18} /> Xem nội dung
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}

const mockQueue = [
  { id: 'MOD-01', title: 'Tích phân từng phần và ứng dụng thực tế', authorName: 'Thầy Nguyễn An', type: 'LESSON', createdAt: '10:30 Hôm nay' },
  { id: 'MOD-02', title: 'Bộ câu hỏi thi thử THPT Quốc gia 2024 - Môn Lý', authorName: 'Cô Lê Hạnh', type: 'QUIZ', createdAt: '09:15 Hôm nay' },
  { id: 'MOD-03', title: 'Combo chinh phục điểm 9+ Khối D', authorName: 'Thầy Minh Trần', type: 'COMBO', createdAt: 'Hôm qua' },
  { id: 'MOD-04', title: 'Lịch sử khai phá vùng đất Nam Bộ', authorName: 'Cô Nguyễn Mai', type: 'LESSON', createdAt: '14:20 Hôm qua' },
];
