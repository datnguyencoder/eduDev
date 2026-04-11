'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileEdit, 
  PlusSquare, 
  Layers, 
  Users, 
  MessageSquare, 
  LogOut,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/store/authStore';

const sidebarItems = [
  { name: 'Tổng quan', href: ROUTES.TEACHER.DASHBOARD, icon: LayoutDashboard },
  { name: 'Quản lý nội dung', href: ROUTES.TEACHER.CONTENT, icon: ClipboardList },
  { name: 'Soạn bài học', href: ROUTES.TEACHER.LESSON_BUILDER, icon: FileEdit },
  { name: 'Tạo Quiz', href: ROUTES.TEACHER.QUIZ_BUILDER, icon: PlusSquare },
  { name: 'Tạo Combo', href: ROUTES.TEACHER.COMBO_BUILDER, icon: Layers },
  { name: 'Học sinh quản lý', href: ROUTES.TEACHER.MONITOR, icon: Users },
  { name: 'Phản hồi', href: ROUTES.TEACHER.FEEDBACKS, icon: MessageSquare },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const { clearAuth } = useAuthStore();

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center border-b border-slate-100 px-6">
        <Link href="/" className="flex items-center gap-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold">e</span>
           </div>
           <span className="text-lg font-bold tracking-tight text-slate-800">eduDev <span className="text-[10px] bg-slate-100 px-1 py-0.5 rounded ml-1 text-slate-500">PRO</span></span>
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
                'group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon size={20} className={cn(isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600')} />
              <span>{item.name}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <button
          onClick={() => clearAuth()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
