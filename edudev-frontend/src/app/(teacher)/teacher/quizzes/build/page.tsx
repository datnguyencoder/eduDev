'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plus, 
  Trash2, 
  Save, 
  ChevronLeft, 
  HelpCircle, 
  CheckCircle2, 
  BrainCircuit,
  Settings2,
  ListOrdered
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const questionSchema = z.object({
  questionText: z.string().min(10, 'Câu hỏi quá ngắn'),
  options: z.array(z.string().min(1, 'Đáp án không được để trống')).length(4),
  correctOrder: z.number().min(0).max(3),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
});

const quizSchema = z.object({
  title: z.string().min(5, 'Tiêu đề quá ngắn'),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'Phải có ít nhất 1 câu hỏi'),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function QuizBuilderPage() {
  const router = useRouter();
  const [activeQuestion, setActiveQuestion] = useState(0);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      questions: [
        { questionText: '', options: ['', '', '', ''], correctOrder: 0, difficulty: 'MEDIUM' }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const onSubmit = (values: QuizFormValues) => {
    console.log('Submit Quiz:', values);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-10">
         <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
               <ChevronLeft size={20} />
            </button>
            <div>
               <h1 className="text-2xl font-black text-slate-800 tracking-tight">Trình tạo Quiz Đánh giá</h1>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Biên soạn bộ câu hỏi trắc nghiệm</p>
            </div>
         </div>
         <button 
           onClick={form.handleSubmit(onSubmit)}
           className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
         >
            <Save size={18} /> Xuất bản Quiz
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Navigation Sidebar (Question List) */}
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                  <span>Danh sách câu hỏi</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-black italic">{fields.length}</span>
               </h3>
               <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {fields.map((field, index) => (
                     <button
                       key={field.id}
                       onClick={() => setActiveQuestion(index)}
                       className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl text-left text-sm font-bold transition-all border italic",
                          activeQuestion === index 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 scale-[1.02]" 
                            : "bg-slate-50 text-slate-500 border-slate-100 hover:border-indigo-200"
                       )}
                     >
                        <span className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black leading-none", activeQuestion === index ? "bg-white/20" : "bg-slate-200 text-slate-500")}>
                           {index + 1}
                        </span>
                        <span className="truncate">{form.watch(`questions.${index}.questionText`) || `Câu hỏi ${index + 1}`}</span>
                     </button>
                  ))}
               </div>
               <button 
                 onClick={() => append({ questionText: '', options: ['', '', '', ''], correctOrder: 0, difficulty: 'MEDIUM' })}
                 className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl font-bold text-xs hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
               >
                  <Plus size={16} /> Thêm câu hỏi mới
               </button>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
               <h4 className="font-bold flex items-center gap-2 mb-4">
                  <BrainCircuit size={18} className="text-indigo-400" /> AI Assistant
               </h4>
               <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  Dùng AI để tự động tạo 4 phương án nhiễu (distractors) dựa trên nội dung câu hỏi của bạn.
               </p>
               <button className="w-full mt-6 py-2 bg-indigo-600 text-[10px] font-black uppercase rounded-lg hover:bg-indigo-500 transition-all">
                  Tạo đáp án gợi ý
               </button>
            </div>
         </div>

         {/* Editor Area */}
         <div className="lg:col-span-9 space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-10">
               {/* Question Content */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <ListOrdered size={20} className="text-indigo-600" /> Biên soạn Câu {activeQuestion + 1}
                     </h3>
                     <div className="flex items-center gap-4">
                        <select 
                          {...form.register(`questions.${activeQuestion}.difficulty`)}
                          className="bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 italic"
                        >
                           <option value="EASY">Độ khó: Dễ</option>
                           <option value="MEDIUM">Độ khó: Vừa</option>
                           <option value="HARD">Độ khó: Khó</option>
                        </select>
                        <button 
                          onClick={() => {
                             if (fields.length > 1) {
                                remove(activeQuestion);
                                setActiveQuestion(Math.max(0, activeQuestion - 1));
                             }
                          }}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                        >
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
                  
                  <textarea 
                    {...form.register(`questions.${activeQuestion}.questionText`)}
                    placeholder="Nhập nội dung câu hỏi tại đây..."
                    rows={4}
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold text-slate-700 placeholder:text-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all"
                  />
               </div>

               {/* Options Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[0, 1, 2, 3].map((idx) => {
                     const label = String.fromCharCode(65 + idx);
                     const isCorrect = form.watch(`questions.${activeQuestion}.correctOrder`) === idx;
                     
                     return (
                        <div key={idx} className={cn(
                           "relative p-6 rounded-2xl border transition-all flex items-center gap-4 group",
                           isCorrect ? "bg-emerald-50 border-emerald-200 shadow-sm" : "bg-white border-slate-100 hover:border-slate-200"
                        )}>
                           <button 
                             type="button"
                             onClick={() => form.setValue(`questions.${activeQuestion}.correctOrder`, idx)}
                             className={cn(
                                "w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center font-black transition-all",
                                isCorrect ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                             )}
                           >
                              {isCorrect ? <CheckCircle2 size={20} /> : label}
                           </button>
                           <input 
                             {...form.register(`questions.${activeQuestion}.options.${idx}`)}
                             placeholder={`Nhập phương án ${label}...`}
                             className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 placeholder:text-slate-300 italic"
                           />
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* Quiz General Settings */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-indigo-50 transition-colors">
                  <Settings2 size={64} />
               </div>
               <div className="relative z-10 max-w-xl">
                  <h3 className="text-xl font-black text-slate-800 mb-6">Cài đặt chung của Quiz</h3>
                  <div className="space-y-6">
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block italic">Tiêu đề bộ Quiz</label>
                        <input 
                          {...form.register('title')}
                          placeholder="VD: Kiểm tra cuối chương 1 - Hàm số"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" 
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block italic">Mô tả ngắn</label>
                        <textarea 
                          {...form.register('description')}
                          placeholder="Mô tả mục tiêu của bộ câu hỏi này..."
                          rows={2}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" 
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
