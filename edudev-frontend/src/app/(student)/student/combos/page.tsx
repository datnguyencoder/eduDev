'use client';

import { useQuery } from '@tanstack/react-query';
import { BookMarked, Code, Lock, PlayCircle, Star, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function StudentCombosPage() {
  const displayCombos = [
    { id: '1', title: 'Luyện thi Đại học Khối A', progress: 45, courses: 3, students: 1200 },
    { id: '2', title: 'Lộ trình Khối D1', progress: 10, courses: 4, students: 850 },
    { id: '3', title: 'Tiếng Anh B1-B2', progress: 80, courses: 2, students: 3000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Combo đã đăng ký</h1>
        <p className="text-sm text-slate-500 mt-1">Tiếp tục hành trình học tập với các gói combo của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCombos.map((combo) => (
          <div key={combo.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <BookMarked size={24} />
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">
                {combo.progress}%
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-2">{combo.title}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">
              Tuyển tập lộ trình hoàn chỉnh, chia nhỏ bài giảng kèm bài tập thực hành. Gồm {combo.courses} khóa học.
            </p>
            
            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${combo.progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <GraduationCap size={14} />
                  <span>{combo.students.toLocaleString()} người học</span>
               </div>
               <Link href="#" className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700">
                 Tiếp tục <PlayCircle size={16} />
               </Link>
            </div>
          </div>
        ))}

        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer min-h-[280px]">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-4">
              <Lock size={20} />
           </div>
           <h3 className="font-bold text-slate-700 mb-1">Khám phá Combo mới</h3>
           <p className="text-sm text-slate-500 mb-4 px-4">Tìm lộ trình mới do AI EduDev gợi ý.</p>
           <Link href="/student/recommendations" className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:text-blue-600 transition-colors">
              Xem Gợi ý
           </Link>
        </div>
      </div>
    </div>
  );
}