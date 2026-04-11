'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Heart, 
  Target,
  Camera,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react';
import { useStudentProfile, useUpdateStudentProfile } from '@/lib/query/hooks/useUser';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên quá ngắn'),
  grade: z.string(),
  targetExamYear: z.string(),
  interestedMajors: z.string().optional(),
  favoriteSubjects: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function StudentProfilePage() {
  const { data: profile, isLoading: isFetching } = useStudentProfile();
  const { mutate: updateProfile, isPending } = useUpdateStudentProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: profile?.fullName || '',
      grade: profile?.grade || '12',
      targetExamYear: String(profile?.targetExamYear || '2025'),
      interestedMajors: profile?.interestedMajors || '',
      favoriteSubjects: profile?.favoriteSubjects || '',
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile({
      ...values,
      targetExamYear: Number(values.targetExamYear),
    });
  };

  if (isFetching) {
    return <div className="animate-pulse space-y-8">
      <div className="h-40 bg-slate-100 rounded-3xl" />
      <div className="h-96 bg-slate-100 rounded-3xl" />
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <h1 className="text-2xl font-bold text-slate-800">Cài đặt Tài khoản</h1>

      {/* Header Profile Info */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
         <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
         <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-12">
            <div className="relative group">
               <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-black shadow-lg overflow-hidden">
                  {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" /> : profile?.fullName.charAt(0)}
               </div>
               <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md text-slate-400 hover:text-blue-600 transition-colors">
                  <Camera size={16} />
               </button>
            </div>
            <div className="flex-1 pb-2">
               <h2 className="text-2xl font-bold text-slate-900">{profile?.fullName}</h2>
               <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                  <Mail size={14} /> {profile?.email}
               </p>
            </div>
            <div className="flex items-center gap-6 pb-2">
               <div className="text-center group pr-6 border-r border-slate-100">
                  <p className="text-xl font-black text-slate-800">12</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bài hoàn thành</p>
               </div>
               <div className="text-center">
                  <p className="text-xl font-black text-blue-600">8.5</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Điểm TB Quiz</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Main Form */}
         <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-8 pb-4 border-b border-slate-50">Hồ sơ học thuật</h3>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <div>
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                     <User size={16} className="text-blue-500" /> Họ và tên
                  </label>
                  <input 
                    {...form.register('fullName')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" 
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                       <GraduationCap size={16} className="text-blue-500" /> Khối lớp
                    </label>
                    <select
                       {...form.register('grade')}
                       className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                       <option value="10">Lớp 10</option>
                       <option value="11">Lớp 11</option>
                       <option value="12">Lớp 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                       <Calendar size={16} className="text-blue-500" /> Năm thi đại học
                    </label>
                    <select
                       {...form.register('targetExamYear')}
                       className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                       <option value="2025">Năm 2025</option>
                       <option value="2026">Năm 2026</option>
                       <option value="2027">Năm 2027</option>
                    </select>
                  </div>
               </div>

               <div>
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                     <Target size={16} className="text-blue-500" /> Ngành học quan tâm
                  </label>
                  <textarea 
                    {...form.register('interestedMajors')}
                    rows={2}
                    placeholder="VD: CNTT, Logistics..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
               </div>

               <div>
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                     <Heart size={16} className="text-blue-500" /> Môn học yêu thích
                  </label>
                  <textarea 
                    {...form.register('favoriteSubjects')}
                    rows={2}
                    placeholder="VD: Toán, Lý, Tiếng Anh..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
               </div>

               <div className="pt-4 flex items-center justify-end gap-4">
                  <button type="button" className="text-sm font-bold text-slate-400 px-6 py-3 hover:text-slate-600 transition-colors">Hủy bỏ</button>
                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/10 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
               </div>
            </form>
         </div>

         {/* Sidebar Stats/Info */}
         <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="font-bold flex items-center gap-2 mb-6">
                     <CheckCircle2 size={18} className="text-blue-400" /> Huy hiệu đạt được
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">🏆</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kiện tướng Toán</p>
                     </div>
                     <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center">
                        <div className="w-10 h-10 bg-amber-500 rounded-full mx-auto mb-2 flex items-center justify-center">🔥</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">7 Ngày liên tiếp</p>
                     </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-10" />
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
               <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" /> Lịch sử đăng nhập
               </h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-50">
                     <span className="text-slate-500">Hôm nay, 14:20</span>
                     <span className="font-bold text-slate-700">Trình duyệt Chrome</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-500">Hôm qua, 09:12</span>
                     <span className="font-bold text-slate-700">Mobile app</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
