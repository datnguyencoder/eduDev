'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-6 text-red-600">
        <ShieldAlert size={64} />
      </div>
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-800">403 - Truy cập bị từ chối</h1>
      <p className="mb-8 max-w-md text-slate-500">
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên hoặc quay lại trang chủ.
      </p>
      <Link
        href="/"
        className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
      >
        Quay lại Trang chủ
      </Link>
    </div>
  );
}
