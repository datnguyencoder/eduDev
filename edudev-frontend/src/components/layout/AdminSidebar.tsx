'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  ShieldCheck, 
  BookMarked, 
  Settings, 
  LogOut,
  ChevronRight,
  BellRing
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/store/authStore';

const sidebarItems = [
  { name: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: BarChart3 },
  { name: 'Người dùng', href: ROUTES.ADMIN.USERS, icon: Users },
  { name: 'Duyệt bài đăng', href: ROUTES.ADMIN.MODERATION, icon: ShieldCheck },
  { name: 'Danh mục Ngành', href: ROUTES.ADMIN.MAJORS, icon: BookMarked },
  // { name: 'Thông báo hệ thống', href: ROUTES.ADMIN.NOTIFICATIONS, icon: BellRing },
  { name: 'Cấu hình hệ thống', href: ROUTES.ADMIN.SETTINGS, icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { clearAuth } = useAuthStore();

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center border-b border-slate-100 px-6">
        <Link href="/" className="flex items-center gap-2">
           <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-xs uppercase italic">ADM</span>
           </div>
           <span className="text-lg font-bold tracking-tight text-slate-800 italic">eduDev <span className="text-indigo-600">Console</span></span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all',
                isActive
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon size={18} className={cn(isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600')} />
              <span>{item.name}</span>
              {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="px-4 py-2 border border-slate-50 rounded-xl bg-slate-50/50 mb-4 transition-all hover:bg-white">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-1">Version 1.0.0-PROD</p>
        </div>
        <button
          onClick={() => clearAuth()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all italic"
        >
          <LogOut size={18} />
          <span>Thoát hệ thống</span>
        </button>
      </div>
    </div>
  );
}
