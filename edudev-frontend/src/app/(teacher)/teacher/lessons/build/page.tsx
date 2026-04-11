'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Save, 
  Eye, 
  ChevronLeft, 
  BookOpen, 
  FileText, 
  Clock, 
  Plus,
  Layers,
  Info,
  CheckCircle2,
  Trash2,
  Paperclip
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSubjects, useTopicsBySubject } from '@/lib/query/hooks/useSubjects';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const lessonSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải từ 5 ký tự'),
  subjectId: z.string().min(1, 'Vui lòng chọn môn học'),
  topicId: z.string().min(1, 'Vui lòng chọn chương/chủ đề'),
  content: z.string().min(50, 'Nội dung bài học phải chi tiết hơn (ít nhất 50 ký tự)'),
  duration: z.coerce.number().min(1, 'Thời lượng phải lớn hơn 0'),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

export default function LessonEditorPage() {
  const router = useRouter();
  const { data: subjects } = useSubjects();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const { data: topics } = useTopicsBySubject(selectedSubject);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      subjectId: '',
      topicId: '',
      content: '',
      duration: 15,
    },
  });

  const onSubmit = (values: LessonFormValues) => {
    console.log('Submit Lesson:', values);
    // Call mutation here
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10 py-4 -mx-4 px-4 border-b border-slate-200/50">
        <button 
           onClick={() => router.back()}
           className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-all font-medium text-sm group"
        >
           <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
           <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 text-slate-600 font-bold text-sm hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
              <Eye size={18} /> Xem trước
           </button>
           <button 
             onClick={form.handleSubmit(onSubmit)}
             className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
           >
              <Save size={18} /> Lưu bài giảng
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Editor Area */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
               <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block italic">Tiêu đề bài học</label>
                  <input 
                    {...form.register('title')}
                    placeholder="Nhập tên bài giảng chuyên nghiệp..."
                    className="w-full text-2xl font-black text-slate-800 border-none px-0 focus:ring-0 placeholder:text-slate-200"
                  />
                  {form.formState.errors.title && <p className="text-red-500 text-xs mt-2">{form.formState.errors.title.message}</p>}
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Nội dung bài học</label>
                     <div className="flex gap-2">
                        <button className="p-1.5 bg-slate-50 rounded hover:bg-slate-100 transition-colors"><FileText size={14} /></button>
                        <button className="p-1.5 bg-slate-50 rounded hover:bg-slate-100 transition-colors"><Plus size={14} /></button>
                     </div>
                  </div>
                  <textarea 
                    {...form.register('content')}
                    rows={15}
                    placeholder="Sử dụng Markdown hoặc trình soạn thảo văn bản tại đây..."
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-medium leading-relaxed focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
                  />
                  {form.formState.errors.content && <p className="text-red-500 text-xs mt-1">{form.formState.errors.content.message}</p>}
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Paperclip size={20} className="text-indigo-600" /> Tài liệu đính kèm
               </h3>
               <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center hover:border-indigo-200 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-50 transition-all">
                     <Plus size={20} className="text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">Thêm tệp đính kèm (.pdf, .zip, .docx)</p>
                  <p className="text-xs text-slate-400 mt-2">Dung lượng tối đa 10MB mỗi tệp</p>
               </div>
            </div>
         </div>

         {/* Settings Sidebar */}
         <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
               <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2 border-b border-slate-50 pb-4">
                  <Layers size={18} className="text-indigo-600" /> Cấu trúc bài học
               </h3>
               
               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Môn học</label>
                    <select 
                       {...form.register('subjectId')}
                       onChange={(e) => {
                          form.register('subjectId').onChange(e);
                          setSelectedSubject(e.target.value);
                       }}
                       className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                    >
                       <option value="">Chọn môn học...</option>
                       {subjects?.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                       ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Chủ đề (Topic)</label>
                    <select 
                       {...form.register('topicId')}
                       disabled={!selectedSubject}
                       className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:outline-none disabled:opacity-50"
                    >
                       <option value="">Chọn chủ đề...</option>
                       {topics?.map((t: any) => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                       ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Thời lượng (Phút)</label>
                    <div className="relative">
                       <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                         {...form.register('duration')}
                         type="number" 
                         className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" 
                       />
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 shadow-xl shadow-slate-200">
               <h4 className="font-bold flex items-center gap-2">
                  <Info size={18} className="text-indigo-400" /> Quy định biên soạn
               </h4>
               <ul className="space-y-4">
                  <li className="flex gap-3 text-xs opacity-80 italic">
                     <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                     Nội dung phải bám sát chương trình THPT mới.
                  </li>
                  <li className="flex gap-3 text-xs opacity-80 italic">
                     <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                     Tránh sao chép nguyên văn từ các nguồn chưa được kiểm chứng.
                  </li>
               </ul>
            </div>

            <button className="w-full py-4 border border-red-100 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all">
               <Trash2 size={18} /> Hủy bài viết này
            </button>
         </div>
      </div>
    </div>
  );
}
