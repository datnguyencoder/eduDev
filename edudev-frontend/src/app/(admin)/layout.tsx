'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Bell, Shield, Terminal } from 'lucide-react';
import { ROLE, ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({
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
      else if (role !== ROLE.ADMIN) router.push(ROUTES.PUBLIC.FORBIDDEN);
    }
  }, [isAuthenticated, role, isLoading, router]);

  if (isLoading || !isAuthenticated || role !== ROLE.ADMIN) return (
     <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Topbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-slate-900/10">
                 <Terminal size={12} /> Console Mode
              </div>
           </div>
           
           <div className="flex items-center gap-4 italic font-bold">
              <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
                 <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                 </button>
                 <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <Shield size={18} />
                 </button>
              </div>
              <div className="flex items-center gap-3 pl-2">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 leading-none">{user?.fullName}</p>
                    <p className="text-[10px] text-red-500 mt-1 uppercase font-black">Super Admin</p>
                 </div>
                 <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md">
                    {user?.fullName?.charAt(0)}
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
