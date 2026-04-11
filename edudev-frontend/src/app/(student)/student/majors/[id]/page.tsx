'use client';

import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Target, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Star,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Users,
  Building
} from 'lucide-react';
import { useMajorDetail, useToggleWishlist } from '@/lib/query/hooks/useMajors';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function MajorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: major, isLoading } = useMajorDetail(params.id as string);
  const { mutate: toggleWishlist } = useToggleWishlist();

  const displayMajor = major || {
    id: params.id,
    name: 'Khoa học Máy tính',
    code: '7480101',
    description: 'Ngành Khoa học máy tính là ngành học tập trung vào việc nghiên cứu cơ sở lý thuyết, thuật toán và các kỹ thuật xử lý thông tin bằng hệ thống máy tính. Sinh viên sẽ được trang bị kiến thức về lập trình, cấu trúc dữ liệu, hệ điều hành, mạng máy tính và trí tuệ nhân tạo.',
    admissionSubjects: ['A00', 'A01', 'D07'],
    salaryRange: '15-25Tr /tháng',
    marketTrend: 'growing',
    careerPaths: ['Lập trình viên Fullstack', 'Phân tích dữ liệu', 'Kỹ sư AI/ML', 'Quản trị hệ thống'],
    suggestedSubjects: ['Toán học', 'Vật lý', 'Tiếng Anh'],
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-all font-medium text-sm mb-8 group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Quay lại danh sách ngành học</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <header>
            <div className="flex flex-wrap items-center gap-4 mb-4">
               <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">MÃ: {displayMajor.code}</span>
               <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase border border-emerald-100 italic">
                  <TrendingUp size={14} /> Xu hướng: {displayMajor.marketTrend === 'growing' ? 'Tăng trưởng mạnh' : 'Ổn định'}
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
               {displayMajor.name}
            </h1>
          </header>

          <section className="space-y-6">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <Target size={24} className="text-blue-600" />
                Giới thiệu ngành học
             </h3>
             <p className="text-lg text-slate-600 leading-relaxed font-medium opacity-90">
                {displayMajor.description}
             </p>
          </section>

          <section className="space-y-8">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <Briefcase size={24} className="text-blue-600" />
                Cơ hội nghề nghiệp
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(displayMajor.careerPaths ?? []).map((path: string) => (
                   <div key={path} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm hover:border-blue-200 transition-colors group">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                         <Target size={20} />
                      </div>
                      <span className="font-bold text-slate-700">{path}</span>
                   </div>
                ))}
             </div>
          </section>

          {/* Education Pathway Visualization */}
          <section className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                   <BookOpen size={28} className="text-blue-400" />
                   Gợi ý lộ trình ôn luyện tại eduDev
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Môn học trọng tâm</h4>
                      <div className="space-y-4">
                         {(displayMajor.suggestedSubjects ?? []).map((sub) => (
                            <div key={sub} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                               <span className="font-bold">{sub}</span>
                               <span className="text-blue-400 font-black">Mục tiêu {sub === 'Toán học' ? '9.5+' : '8.5+'}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="p-8 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex flex-col justify-between">
                      <div>
                         <h4 className="font-bold text-lg mb-2">Combo Đột phá</h4>
                         <p className="text-blue-100 text-sm opacity-80 mb-6">Combo này được lọc riêng để tối ưu hóa khả năng trúng tuyển vào ngành {displayMajor.name}.</p>
                      </div>
                      <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                         Bắt đầu ngay <ArrowRight size={18} />
                      </button>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20" />
          </section>
        </div>

        {/* Action Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 text-right">Học phí dự kiến</p>
                    <p className="text-xl font-black text-slate-800">45-60tr <span className="text-xs text-slate-400">/năm</span></p>
                 </div>
                 <button 
                   onClick={() => toggleWishlist(String(displayMajor.id))}
                   className="p-3 border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                 >
                    <Star size={24} />
                 </button>
              </div>
              
              <div className="space-y-10">
                 <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <MapPin size={14} className="text-blue-500" /> Khối thi xét tuyển
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {(displayMajor.admissionSubjects ?? []).map((sub) => (
                          <span key={sub} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-black text-slate-700">{sub}</span>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95">
                       Tư vấn chi tiết (AI)
                    </button>
                    <button className="w-full py-4 border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                       Website trường TOP <ExternalLink size={18} />
                    </button>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-white border border-slate-200 rounded-2xl space-y-6">
              <h4 className="font-bold flex items-center gap-2">
                 <Users size={20} className="text-blue-500" /> 
                 Đội ngũ Mentor
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">Kết nối với các sinh viên khóa trên và giáo viên đang làm việc trong ngành học này.</p>
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
                       U{i}
                    </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">+12</div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
