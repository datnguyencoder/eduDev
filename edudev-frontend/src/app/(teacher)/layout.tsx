'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeacherSidebar } from '@/components/layout/TeacherSidebar';
import { Bell, Search, Settings } from 'lucide-react';
import { ROLE, ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/store/authStore';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();
  const role = user?.role;

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.push(ROUTES.PUBLIC.LOGIN);
      else if (role !== ROLE.TEACHER) router.push(ROUTES.PUBLIC.FORBIDDEN);
    }
  }, [isAuthenticated, role, isLoading, router]);

  if (isLoading || !isAuthenticated || role !== ROLE.TEACHER) return (
     <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Teacher Topbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
           <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Tìm nội dung, học sinh..." 
                   className="pl-10 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 w-[280px]"
                 />
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                 <Bell size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                 <Settings size={20} />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100 italic">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 leading-none">{user?.fullName}</p>
                    <p className="text-[10px] text-indigo-600 mt-1 uppercase font-black">Giảng viên chuyên môn</p>
                 </div>
                 <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold overflow-hidden border-2 border-white shadow-sm">
                    {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" /> : user?.fullName?.charAt(0)}
                 </div>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
