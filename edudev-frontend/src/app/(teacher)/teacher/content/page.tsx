'use client';

import { useEffect, useState } from 'react';
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
  Edit,
  Loader2,
  Eye,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { teacherApi, ManagedContent } from '@/lib/api/teacherApi';

export default function TeacherContentPage() {
  const [contents, setContents] = useState<ManagedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LESSON' | 'QUIZ' | 'COMBO'>('ALL');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await teacherApi.getManagedContent();
        setContents(data || []);
      } catch (err: any) {
        // Fallback or handle error elegantly
        setError(err.message || 'Không thể tải dữ liệu nội dung');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const filteredContents = contents.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Quản lý Nội dung</h1>
          <p className="text-sm text-slate-500 mt-2">Toàn bộ giáo trình, bài giảng và bài thi đánh giá do bạn thiết kế.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/teacher/lessons/build" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all border border-blue-100 hover:shadow-sm active:scale-95">
            <FileEdit size={16} /> Soạn Bài giảng
          </Link>
          <Link href="/teacher/quizzes/build" className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-100 hover:shadow-sm active:scale-95">
            <PlusSquare size={16} /> Tạo Quiz
          </Link>
          <Link href="/teacher/combos/build" className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-100 transition-all border border-purple-100 hover:shadow-sm active:scale-95">
            <Layers size={16} /> Đóng Combo
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
         <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nội dung, mã bài giảng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all"
            />
         </div>
         <div className="flex bg-slate-100 p-1.5 rounded-xl self-stretch sm:self-auto gap-1 shadow-inner">
            <button 
                onClick={() => setTypeFilter('ALL')}
                className={`px-4 py-1.5 font-bold text-sm rounded-lg transition-all ${typeFilter === 'ALL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Tất cả
            </button>
            <button 
                onClick={() => setTypeFilter('LESSON')}
                className={`px-4 py-1.5 font-bold text-sm rounded-lg transition-all ${typeFilter === 'LESSON' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Bài giảng
            </button>
            <button 
                onClick={() => setTypeFilter('QUIZ')}
                className={`px-4 py-1.5 font-bold text-sm rounded-lg transition-all ${typeFilter === 'QUIZ' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Quiz
            </button>
            <button 
                onClick={() => setTypeFilter('COMBO')}
                className={`px-4 py-1.5 font-bold text-sm rounded-lg transition-all ${typeFilter === 'COMBO' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Combo
            </button>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-extrabold border-b border-slate-200">
              <th className="p-5">Nội dung</th>
              <th className="p-5 hidden md:table-cell text-center">Loại</th>
              <th className="p-5 hidden sm:table-cell text-center">Trạng thái</th>
              <th className="p-5 hidden lg:table-cell">Cập nhật</th>
              <th className="p-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
                <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                         <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-500" />
                         <p className="text-sm font-medium">Đang tải nội dung chuyên môn...</p>
                    </td>
                </tr>
            ) : error ? (
                <tr>
                    <td colSpan={5} className="p-12 text-center text-amber-600 bg-amber-50">
                        <AlertCircle className="w-8 h-8 mx-auto mb-4" />
                        <p className="text-sm font-bold">Không có nội dung. Bắt đầu tạo bài giảng đầu tiên của bạn!</p>
                    </td>
                </tr>
            ) : filteredContents.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">
                        Nội dung không tồn tại hoặc không phù hợp với bộ lọc tìm kiếm.
                    </td>
                </tr>
            ) : filteredContents.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white border border-slate-200 shadow-sm">
                      {item.type === 'LESSON' && <BookOpen size={22} className="text-blue-500" />}
                      {item.type === 'QUIZ' && <PlayCircle size={22} className="text-emerald-500" />}
                      {item.type === 'COMBO' && <Layers size={22} className="text-purple-500" />}
                    </div>
                    <div>
                        <span className="font-bold text-slate-800 block text-base leading-snug">{item.title}</span>
                        <span className="text-xs text-slate-400 font-medium">ID: #{item.id.slice(0, 6)}</span>
                    </div>
                  </div>
                </td>
                <td className="p-5 hidden md:table-cell text-center">
                  <span className={`capitalize text-[11px] font-black px-3 py-1.5 rounded-lg border ${
                      item.type === 'LESSON' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      item.type === 'QUIZ' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-purple-50 text-purple-600 border-purple-100'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="p-5 hidden sm:table-cell">
                  <div className="flex justify-center">
                  {item.status === 'APPROVED' ? (
                     <span className="flex w-fit items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <CheckCircle2 size={14} /> Approved
                     </span>
                  ) : item.status === 'PENDING' ? (
                     <span className="flex w-fit items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                        <Clock size={14} /> Pending Review
                     </span>
                  ) : (
                     <span className="flex w-fit items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <FileEdit size={14} /> Draft
                     </span>
                  )}
                  </div>
                </td>
                <td className="p-5 hidden lg:table-cell text-sm text-slate-500 font-medium">
                  {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="p-5">
                  <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shadow-sm bg-white border border-slate-200 hover:border-blue-200">
                      <Edit size={16} />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shadow-sm bg-white border border-slate-200">
                      <Eye size={16} />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shadow-sm bg-white border border-slate-200 hover:border-red-200">
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