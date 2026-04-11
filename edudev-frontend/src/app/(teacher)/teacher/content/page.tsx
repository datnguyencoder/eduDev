'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  FileEdit, 
  PlusSquare, 
  Layers, 
  Search, 
  Filter, 
  MoreVertical,
  BookOpen,
  PlayCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Edit
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherContentPage() {
  const contents = [
    { id: 1, type: 'lesson', title: 'Bài giảng Phương trình Bậc 2', status: 'published', date: '12/10/2025', views: 342 },
    { id: 2, type: 'quiz',   title: 'Quiz 15p: Động học Chất điểm', status: 'published', date: '05/10/2025', views: 890 },
    { id: 3, type: 'combo',  title: 'Luyện thi Lý Khối A', status: 'draft', date: '01/10/2025', views: 0 },
    { id: 4, type: 'lesson', title: 'Giới thiệu về Tiến hóa', status: 'published', date: '28/09/2025', views: 1205 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Nội dung</h1>
          <p className="text-sm text-slate-500 mt-1">Danh sách bài giảng, đề thi và lộ trình do bạn biên soạn.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/teacher/lessons/build" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors border border-blue-100">
            <FileEdit size={16} /> Soạn Bài giảng
          </Link>
          <Link href="/teacher/quizzes/build" className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors border border-emerald-100">
            <PlusSquare size={16} /> Tạo Quiz
          </Link>
          <Link href="/teacher/combos/build" className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-100 transition-colors border border-purple-100">
            <Layers size={16} /> Đóng Gói Combo
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
         <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nội dung..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
         </div>
         <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto">
            <button className="px-4 py-1.5 bg-white text-slate-800 font-bold text-sm rounded-lg shadow-sm border border-slate-200">Tất cả</button>
            <button className="px-4 py-1.5 text-slate-500 font-bold text-sm rounded-lg hover:text-slate-700">Bài giảng</button>
            <button className="px-4 py-1.5 text-slate-500 font-bold text-sm rounded-lg hover:text-slate-700">Đề thi / Quiz</button>
            <button className="px-4 py-1.5 text-slate-500 font-bold text-sm rounded-lg hover:text-slate-700">Combo</button>
         </div>
      </div>

      <div className="bg-white border text-center border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
              <th className="p-4">Nội dung</th>
              <th className="p-4 hidden md:table-cell">Loại</th>
              <th className="p-4 hidden sm:table-cell">Trạng thái</th>
              <th className="p-4 hidden lg:table-cell">Ngày tạo</th>
              <th className="p-4 text-right">Lượt xem</th>
              <th className="p-4 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contents.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-500">
                      {item.type === 'lesson' && <BookOpen size={20} className="text-blue-500" />}
                      {item.type === 'quiz' && <PlayCircle size={20} className="text-emerald-500" />}
                      {item.type === 'combo' && <Layers size={20} className="text-purple-500" />}
                    </div>
                    <span className="font-bold text-slate-800">{item.title}</span>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="capitalize text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {item.type}
                  </span>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  {item.status === 'published' ? (
                     <span className="flex w-fit items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        <CheckCircle2 size={14} /> Đã xuất bản
                     </span>
                  ) : (
                     <span className="flex w-fit items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        <Clock size={14} /> Bản nháp
                     </span>
                  )}
                </td>
                <td className="p-4 hidden lg:table-cell text-sm text-slate-500 font-medium">
                  {item.date}
                </td>
                <td className="p-4 text-right font-mono text-sm font-bold text-slate-600">
                  {item.views > 0 ? item.views.toLocaleString() : '-'}
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}