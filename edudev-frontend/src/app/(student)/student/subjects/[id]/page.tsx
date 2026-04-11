'use client';

import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Play, 
  CheckCircle2, 
  Lock, 
  Clock,
  BookOpen,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useSubjectTopics } from '@/lib/query/hooks/useSubjects';
import { cn } from '@/lib/utils';

export default function SubjectTopicsPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;
  const { data: topics, isLoading } = useSubjectTopics(subjectId);

  // Mock subject info
  const subjectName = "Toán học 12";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button & Header */}
      <div>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại danh sách môn học</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                 <BookOpen size={32} />
              </div>
              <div>
                 <h1 className="text-3xl font-bold text-slate-900">{subjectName}</h1>
                 <p className="text-slate-500 mt-1">Khám phá nội dung chi tiết và bắt đầu học tập.</p>
              </div>
           </div>
           <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiến độ tổng</p>
                 <p className="text-xl font-black text-blue-600">35%</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 rotate-[45deg]" />
           </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4 text-blue-800">
         <Info size={24} className="flex-shrink-0" />
         <div className="text-sm">
            <h4 className="font-bold mb-1">Lời khuyên của giáo viên</h4>
            <p className="opacity-90 leading-relaxed">
               Nội dung phần "Giải tích 12" chiếm 50% cấu trúc đề thi THPT Quốc gia. Hãy dành nhiều thời gian hơn cho Chương 1 và Chương 2.
            </p>
         </div>
      </div>

      {/* Topics List */}
      <div className="space-y-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
             <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))
        ) : (
          (topics || mockTopics).map((topic, topicIdx) => (
            <div key={topic.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                    {topicIdx + 1}
                  </span>
                  <h3 className="font-bold text-slate-800 text-lg">{topic.name}</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{(topic.lessons ?? []).length} bài học</span>
              </div>
              
              <div className="divide-y divide-slate-100">
                {(topic.lessons ?? []).map((lesson) => (
                   <LessonRow key={lesson.id} lesson={lesson} subjectId={subjectId} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LessonRow({ lesson, subjectId }: any) {
  return (
    <Link 
      href={`/student/lessons/${lesson.id}`}
      className="flex items-center gap-4 p-5 hover:bg-blue-50/50 transition-all group"
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
        lesson.isCompleted 
          ? "bg-green-100 text-green-600" 
          : "bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white"
      )}>
        {lesson.isCompleted ? <CheckCircle2 size={20} /> : <Play size={18} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-bold text-sm truncate transition-colors",
          lesson.isCompleted ? "text-slate-500" : "text-slate-800 group-hover:text-blue-700"
        )}>
          {lesson.title}
        </h4>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium text-slate-400">
           <span className="flex items-center gap-1"><Clock size={12} /> {lesson.duration} phút</span>
           <span className="bg-slate-100 px-2 py-0.5 rounded uppercase">Lý thuyết</span>
        </div>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
         <span className="text-blue-600 text-sm font-bold">Học ngay</span>
      </div>
    </Link>
  );
}

const mockTopics = [
  {
    id: 't1',
    name: 'Ứng dụng đạo hàm để khảo sát hàm số',
    lessons: [
      { id: 'l1', title: 'Tính đơn điệu của hàm số', duration: 15, isCompleted: true },
      { id: 'l2', title: 'Cực trị của hàm số', duration: 20, isCompleted: true },
      { id: 'l3', title: 'Giá trị lớn nhất, giá trị nhỏ nhất', duration: 25, isCompleted: false },
      { id: 'l4', title: 'Đường tiệm cận của đồ thị hàm số', duration: 18, isCompleted: false },
    ]
  },
  {
    id: 't2',
    name: 'Hàm số lũy thừa, mũ và logarit',
    lessons: [
      { id: 'l5', title: 'Lũy thừa và hàm số lũy thừa', duration: 20, isCompleted: false },
      { id: 'l6', title: 'Logarit và các tính chất', duration: 22, isCompleted: false },
      { id: 'l7', title: 'Hàm số mũ và hàm số logarit', duration: 30, isCompleted: false },
    ]
  }
];
