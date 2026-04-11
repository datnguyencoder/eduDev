'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/StudentSidebar';
import { Bell } from 'lucide-react';
import { ROLE, ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/store/authStore';

export default function StudentLayout({
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
      else if (role !== ROLE.STUDENT) router.push(ROUTES.PUBLIC.FORBIDDEN);
    }
  }, [isAuthenticated, role, isLoading, router]);

  if (isLoading || !isAuthenticated || role !== ROLE.STUDENT) return (
     <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Student Topbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
           <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Khu vực Học sinh</span>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-semibold text-slate-800">Cá nhân hóa</span>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                 <Bell size={20} />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100 italic">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 leading-none">{user?.fullName}</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Khối 12</p>
                 </div>
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden border-2 border-white shadow-sm">
                    {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" /> : user?.fullName?.charAt(0)}
                 </div>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
