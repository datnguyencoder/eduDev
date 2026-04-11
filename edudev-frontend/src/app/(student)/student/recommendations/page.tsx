'use client';

import { 
  BrainCircuit, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Star,
  ArrowRight,
  Info,
  Sparkles,
  PieChart
} from 'lucide-react';
import Link from 'next/link';
import { useRecommendations, useToggleWishlist } from '@/lib/query/hooks/useMajors';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Major, RecommendationResponse } from '@/lib/api/majorApi';

export default function RecommendationPage() {
  const { data: recommendations, isLoading } = useRecommendations();
  const { mutate: toggleWishlist } = useToggleWishlist();

  // Mock data if API is not available
  const topMajors: Major[] = recommendations
    ? recommendations.map((item: RecommendationResponse) => ({
        id: item.suggestedMajorId,
        name: item.suggestedMajorName,
        code: item.suggestedMajorCode,
        fitnessScore: Math.round(item.confidenceScore),
        aiAdvice: item.reasoning,
        admissionSubjects: [],
        marketTrend: 'stable',
      }))
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* AI Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-10 text-white shadow-2xl shadow-blue-500/20">
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/10 backdrop-blur-md">
                 <Sparkles size={14} className="text-yellow-400" />
                 <span>Hệ thống phân tích AI eduDev</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  Lộ trình nghề nghiệp của bạn đã sẵn sàng!
               </h1>
               <p className="text-blue-100/80 text-lg max-w-xl leading-relaxed">
                  Chúng tôi đã phân tích hơn 500 điểm dữ liệu từ kết quả học tập, sở thích và xu hướng thị trường để đưa ra gợi ý tốt nhất cho riêng bạn.
               </p>
            </div>
            
            <div className="w-full md:w-auto flex justify-center">
               <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-20" />
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-white/20 animate-spin" />
                  <div className="relative w-32 h-32 bg-white rounded-3xl rotate-12 flex items-center justify-center shadow-2xl">
                     <BrainCircuit size={64} className="text-blue-600 -rotate-12" />
                  </div>
               </div>
            </div>
         </div>
         
         {/* Decorative Mesh Background */}
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 400" className="w-full h-full">
               <path fill="white" d="M100,200 Q150,50 200,200 T300,200" />
               <path fill="white" d="M80,220 Q130,70 180,220 T280,220" />
            </svg>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Recommendations */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <Target size={24} className="text-blue-600" />
                  Top 3 Ngành học phù hợp nhất
               </h2>
               <Link href="/student/majors" className="text-sm font-bold text-blue-600 hover:underline">Xem tất cả các ngành</Link>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                [...Array(3)].map((_, i) => <div key={i} className="h-44 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse" />)
              ) : topMajors.length === 0 ? (
                <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
                   <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><BrainCircuit size={32} /></div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa đủ dữ liệu phân tích</h3>
                   <p className="text-slate-500 max-w-md mx-auto text-sm">Hệ thống AI cần bạn hoàn thành thêm các bài kiểm tra và bài giảng để có thể đưa ra gợi ý ngành nghề chính xác nhất.</p>
                </div>
              ) : (
                topMajors.map((major, idx) => (
                  <MajorRecommendationCard 
                    key={major.id} 
                    major={major} 
                    rank={idx + 1} 
                    onWishlist={() => toggleWishlist(String(major.id))}
                  />
                ))
              )}
            </div>
         </div>

         {/* Side Analysis */}
         <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <PieChart size={20} className="text-blue-600" />
                  Môn học mục tiêu
               </h3>
               <p className="text-sm text-slate-500 mb-6">Bạn nên tập trung nâng cao điểm số ở các môn này để tăng khả năng đỗ vào ngành TOP 1.</p>
               
               <div className="space-y-4">
                  <FocusSubjectItem name="Toán học" level="Bắt buộc" score="9.5" color="blue" />
                  <FocusSubjectItem name="Tiếng Anh" level="Tiềm năng" score="7.2" color="indigo" />
                  <FocusSubjectItem name="Vật lý" level="Cần cải thiện" score="6.8" color="amber" />
               </div>

               <button className="w-full mt-8 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                  Xem lộ trình ôn tập <ArrowRight size={16} />
               </button>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl text-white">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Info size={20} />
               </div>
               <h4 className="font-bold text-lg mb-4">Bạn có biết?</h4>
               <p className="text-slate-400 text-sm leading-relaxed">
                  Ngành Khoa học Máy tính hiện đang có mức lương khởi điểm trung bình cao hơn 40% so với các nhóm ngành khác trong khu vực.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function MajorRecommendationCard({ major, rank, onWishlist }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-xl hover:shadow-blue-500/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors" />
      
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Fitness Score Circle */}
        <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-600 relative">
           <span className="text-xl font-black text-slate-800">{major.fitnessScore}%</span>
           <div className="absolute -bottom-2 bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold">KHỚP</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
             <span className="text-xs font-black text-blue-600 uppercase">Hạng #{rank}</span>
             <h3 className="text-xl font-bold text-slate-900 truncate">{major.name}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-4">
             <span>Mã ngành: {major.code}</span>
             <span className="flex items-center gap-1"><TrendingUp size={14} className="text-green-500" /> Xu hướng cao</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl flex gap-3 items-start border border-slate-100">
             <BrainCircuit size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
             <p className="text-sm text-slate-600 leading-relaxed italic">
                "{major.aiAdvice}"
             </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-row md:flex-col gap-3">
           <button 
             onClick={onWishlist}
             className="flex-1 md:flex-none p-3 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all group/star"
           >
              <Star size={20} className="group-hover/star:fill-red-500" />
           </button>
           <Link 
             href={`/student/majors/${major.id}`}
             className="flex-1 md:flex-none bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center"
           >
              Chi tiết
           </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FocusSubjectItem({ name, level, score, color }: any) {
  const colors: any = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
       <div className="flex items-center gap-4">
          <div className={cn("w-2 h-8 rounded-full", colors[color].split(' ')[0])} />
          <div>
             <h5 className="font-bold text-slate-800 text-sm leading-none mb-1">{name}</h5>
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{level}</span>
          </div>
       </div>
       <div className="text-right">
          <div className="text-sm font-black text-slate-800">{score}</div>
          <div className="text-[10px] text-slate-400 font-medium">Trung bình</div>
       </div>
    </div>
  );
}
