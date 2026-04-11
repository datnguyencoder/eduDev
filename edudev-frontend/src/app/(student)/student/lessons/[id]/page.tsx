'use client';

import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Bookmark, 
  Share2, 
  FileText, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useLessonDetail, useCompleteLesson } from '@/lib/query/hooks/useSubjects';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function LessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { data: lesson, isLoading } = useLessonDetail(params.id as string);
  const { mutate: completeLesson, isPending } = useCompleteLesson();

  const handleComplete = () => {
    completeLesson(params.id as string, {
      onSuccess: () => {
        // Maybe show a toast or auto-navigate to next
      }
    });
  };

  const displayLesson = lesson || null;

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10 py-4 -mx-4 px-4 border-b border-slate-200/50">
        <button 
           onClick={() => router.back()}
           className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-all font-medium text-sm group"
        >
           <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
           <span>Trở về lộ trình</span>
        </button>

        <div className="flex items-center gap-3">
           <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors border border-transparent rounded-full hover:bg-white hover:border-slate-100">
              <Bookmark size={20} />
           </button>
           <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors border border-transparent rounded-full hover:bg-white hover:border-slate-100">
              <Share2 size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-10">
           <header>
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">
                 <BookOpen size={14} />
                 <span>Toán học 12 • Chương 1 • Bài 01</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                 {displayLesson.title}
              </h1>
           </header>

           {/* Content Viewer */}
           <div 
             className="prose prose-slate lg:prose-lg max-w-none text-slate-700 leading-relaxed
             prose-headings:text-slate-900 prose-headings:font-bold
             prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
             prose-p:mb-6
             prose-li:mb-2
             prose-strong:text-slate-900"
             dangerouslySetInnerHTML={{ __html: displayLesson.content ?? '' }}
           />

           {/* Completion Action */}
           <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col items-center text-center">
              {displayLesson.isCompleted ? (
                 <div className="flex items-center gap-3 px-8 py-4 bg-green-50 rounded-2xl text-green-700 font-bold border border-green-100">
                    <CheckCircle size={24} />
                    <span>Bạn đã hoàn thành bài học này!</span>
                 </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-500 font-medium italic">Bạn đã nắm vững kiến thức này chưa?</p>
                  <button 
                    onClick={handleComplete}
                    disabled={isPending}
                    className="flex items-center gap-3 px-10 py-4 bg-blue-600 rounded-full text-white font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Đánh dấu hoàn thành bài học
                  </button>
                </div>
              )}
           </div>
        </div>

        {/* Sidebar: Resources & Next up */}
        <aside className="lg:col-span-1 space-y-10">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <FileText size={18} className="text-blue-500" />
                 Tài liệu đính kèm
              </h4>
              <ul className="space-y-4">
                 <li>
                    <Link href="#" className="flex items-center justify-between text-sm group hover:text-blue-600 transition-colors">
                       <span className="truncate pr-2">File tóm tắt kiến thức (.pdf)</span>
                       <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                 </li>
                 <li>
                    <Link href="#" className="flex items-center justify-between text-sm group hover:text-blue-600 transition-colors">
                       <span className="truncate pr-2">Bài tập tự luyện (Google Form)</span>
                       <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                 </li>
              </ul>
           </div>

           <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Bài học tiếp theo</p>
              <h5 className="font-bold text-lg mb-6 leading-snug">Cực trị của hàm số và các dạng toán thường gặp</h5>
              <button 
                className="w-full py-3 bg-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all active:scale-[0.98]"
              >
                Học bài tiếp <ChevronRight size={18} />
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
}
