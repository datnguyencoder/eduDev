'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Package, 
  Target, 
  Layers, 
  Plus, 
  Trash2, 
  Save, 
  ChevronLeft,
  Search,
  CheckCircle2,
  Info,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMajors } from '@/lib/query/hooks/useMajors';
import { useSubjects } from '@/lib/query/hooks/useSubjects';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const comboSchema = z.object({
  name: z.string().min(5, 'Tên combo quá ngắn'),
  description: z.string().min(20, 'Vui lòng nhập mô tả chi tiết'),
  targetMajorId: z.string().min(1, 'Vui lòng chọn ngành mục tiêu'),
  topicIds: z.array(z.string()).min(1, 'Chọn ít nhất 1 chủ đề'),
  price: z.coerce.number().min(0),
});

type ComboFormValues = z.infer<typeof comboSchema>;

export default function ComboBuilderPage() {
  const router = useRouter();
  const { data: majors } = useMajors();
  const { data: subjects } = useSubjects();
  
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const form = useForm<ComboFormValues>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      name: '',
      description: '',
      targetMajorId: '',
      topicIds: [],
      price: 0,
    },
  });

  const onSubmit = (values: ComboFormValues) => {
    console.log('Submit Combo:', values);
  };

  const toggleTopic = (id: string) => {
    const newTopics = selectedTopics.includes(id) 
      ? selectedTopics.filter(t => t !== id) 
      : [...selectedTopics, id];
    setSelectedTopics(newTopics);
    form.setValue('topicIds', newTopics);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-10">
         <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
               <ChevronLeft size={20} />
            </button>
            <div>
               <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tạo Combo Học thuật</h1>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Đóng gói khóa học theo mục tiêu nghề nghiệp</p>
            </div>
         </div>
         <button 
           onClick={form.handleSubmit(onSubmit)}
           className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
         >
            <Save size={18} /> Lưu Combo
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Config Area */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-full">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Tên gói Combo</label>
                     <input 
                       {...form.register('name')}
                       placeholder="VD: Luyện thi cấp tốc Khối A00 - Bách Khoa"
                       className="w-full text-2xl font-black text-slate-800 border-none px-0 focus:ring-0 placeholder:text-slate-100"
                     />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Ngành học mục tiêu</label>
                    <div className="relative">
                       <Target size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <select 
                         {...form.register('targetMajorId')}
                         className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                       >
                          <option value="">Chọn ngành học...</option>
                          {majors?.map((m: any) => (
                             <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                       </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Giá gói (VNĐ)</label>
                    <div className="relative">
                       <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                         {...form.register('price')}
                         type="number"
                         placeholder="0 (Miễn phí)"
                         className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                       />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block italic">Mô tả và Cam kết</label>
                    <textarea 
                      {...form.register('description')}
                      rows={4}
                      placeholder="Mô tả giá trị của gói combo này đối với học sinh..."
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                    />
                  </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     <Layers size={22} className="text-indigo-600" /> Chọn các chủ đề (Topics)
                  </h3>
                  <div className="relative">
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="text" placeholder="Tìm chủ đề..." className="pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-xs" />
                  </div>
               </div>

               <div className="space-y-4">
                  {subjects?.map((subject: any) => (
                     <div key={subject.id} className="space-y-3">
                        <h4 className="text-xs font-black text-slate-400 uppercase italic tracking-tighter border-l-2 border-indigo-600 pl-2">{subject.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                           {/* Using static mock topics for demonstration if sub-topics are missing */}
                           {['Cực trị hàm số', 'Đạo hàm bậc cao', 'Tích phân từng phần'].map((tName, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => toggleTopic(`${subject.id}-${i}`)}
                                className={cn(
                                   "flex items-center justify-between p-4 rounded-2xl border text-sm font-bold transition-all",
                                   selectedTopics.includes(`${subject.id}-${i}`) 
                                     ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                                     : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                                )}
                              >
                                 <span className="truncate">{tName}</span>
                                 {selectedTopics.includes(`${subject.id}-${i}`) && <CheckCircle2 size={16} className="text-indigo-600" />}
                              </button>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Stats Sidebar */}
         <div className="space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-8 shadow-2xl">
               <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Xem trước hiển thị</h4>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 italic">
                  <Package size={32} className="text-indigo-400 mb-4" />
                  <h5 className="font-bold text-lg mb-2 truncate">{form.watch('name') || 'Tên Combo...'}</h5>
                  <p className="text-xs text-slate-400 mb-6 line-clamp-2">{form.watch('description') || 'Mô tả ngắn...'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                     <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-bold">Khối A00</span>
                     </div>
                     <span className="text-sm font-black text-indigo-400">{form.watch('price') > 0 ? `${form.watch('price').toLocaleString()}đ` : 'Miễn phí'}</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-400">Tổng số chủ đề:</span>
                     <span className="font-bold text-indigo-400">{selectedTopics.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-400">Trạng thái:</span>
                     <span className="px-2 py-0.5 bg-white/10 rounded font-bold">BẢN NHÁP</span>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
               <h4 className="font-bold flex items-center gap-2">
                  <Info size={18} className="text-indigo-600" /> Lưu ý chuyên môn
               </h4>
               <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-indigo-100 pl-4">
                  Gói Combo có tỷ lệ học sinh đăng ký cao nhất thường bao gồm từ **5-8 chủ đề trọng tâm** và có bài kiểm tra đầu ra đi kèm.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
