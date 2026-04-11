'use client';

import { 
  BookOpen, 
  ChevronRight, 
  Search, 
  Filter,
  GraduationCap,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { useSubjects } from '@/lib/query/hooks/useSubjects';

export default function SubjectsPage() {
  const { data: subjects, isLoading } = useSubjects();

  // Mock data if API is not available yet
  const displaySubjects = subjects || [
    { id: '1', name: 'Toán học', description: 'Đại số, Hình học và Giải tích lớp 12', totalLessons: 24, completedLessons: 8 },
    { id: '2', name: 'Vật lý', description: 'Cơ học, Nhiệt học và Điện xoay chiều', totalLessons: 20, completedLessons: 4 },
    { id: '3', name: 'Hóa học', description: 'Hóa hữu cơ và Vô cơ chuyên sâu', totalLessons: 18, completedLessons: 0 },
    { id: '4', name: 'Tiếng Anh', description: 'Từ vựng, Ngữ pháp và Luyện thi đại học', totalLessons: 30, completedLessons: 15 },
    { id: '5', name: 'Sinh học', description: 'Di truyền, Tiến hóa và Sinh thái học', totalLessons: 15, completedLessons: 2 },
    { id: '6', name: 'Ngữ văn', description: 'Nghị luận xã hội và Tác phẩm văn học trọng điểm', totalLessons: 12, completedLessons: 6 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Khám phá Môn học</h1>
          <p className="text-sm text-slate-500 mt-1">Lựa chọn môn học để bắt đầu lộ trình của bạn.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm môn học..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-[240px] shadow-sm"
              />
           </div>
           <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
           </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySubjects.map((subject: any) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubjectCard({ subject }: any) {
  const percent = Math.round((subject.completedLessons / subject.totalLessons) * 100);
  
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
      <div>
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <BookOpen size={28} />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
             <Layers size={12} />
             <span>{subject.totalLessons} bài học</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">{subject.name}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          {subject.description}
        </p>
      </div>

      <div className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight text-slate-400">
             <span>Tiến độ học tập</span>
             <span className="text-blue-600">{percent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/30" 
               style={{ width: `${percent}%` }} 
             />
          </div>
        </div>

        <Link 
          href={`/student/subjects/${subject.id}`}
          className="w-full mt-2 py-3 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] group-hover:shadow-lg shadow-black/10"
        >
          Tiếp tục học <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
