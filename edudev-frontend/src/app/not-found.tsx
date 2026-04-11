'use client';

import Link from 'next/link';
import { SearchX } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="mb-6 rounded-full bg-blue-100 p-6 text-blue-600">
        <SearchX size={64} />
      </div>
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-800">404 - Không tìm thấy trang</h1>
      <p className="mb-8 max-w-sm text-slate-500">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
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
