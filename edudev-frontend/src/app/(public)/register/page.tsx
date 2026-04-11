'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRegisterStudent } from '@/lib/query/hooks/useAuth';
import { ROUTES } from '@/lib/constants/routes';
import type { ApiError } from '@/lib/api/types';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Hãy nhập lại mật khẩu'),
  grade: z.string().min(1, 'Hãy chọn khối lớp'),
  targetExamYear: z.string().min(1, 'Hãy chọn năm thi'),
  interestedMajors: z.string().optional(),
  favoriteSubjects: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { mutate: register, isPending, error } = useRegisterStudent();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      grade: '12',
      targetExamYear: '2025',
      interestedMajors: '',
      favoriteSubjects: '',
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...submitData } = values;
    register({
      ...submitData,
      targetExamYear: Number(submitData.targetExamYear),
    });
  };

  return (
    <div className="flex bg-slate-50 min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-2xl border border-slate-200 bg-white p-10 rounded-2xl shadow-sm">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Đăng ký thành viên</h1>
          <p className="mt-2 text-slate-500">Bắt đầu hành trình học tập và hướng nghiệp cùng eduDev</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2 mb-4">Thông tin cơ bản</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên</label>
              <input
                {...form.register('fullName')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="Nguyễn Văn A"
              />
              {form.formState.errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                {...form.register('email')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="name@example.com"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                {...form.register('password')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nhập lại mật khẩu</label>
              <input
                type="password"
                {...form.register('confirmPassword')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
              {form.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Cột 2: Thông tin học tập */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2 mb-4">Mục tiêu học tập</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Khối lớp</label>
                <select
                  {...form.register('grade')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
                >
                  <option value="10">Lớp 10</option>
                  <option value="11">Lớp 11</option>
                  <option value="12">Lớp 12</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Năm thi</label>
                <select
                  {...form.register('targetExamYear')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngành học quan tâm</label>
              <textarea
                {...form.register('interestedMajors')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                rows={2}
                placeholder="CNTT, Kinh tế, Y dược..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Môn học yêu thích</label>
              <textarea
                {...form.register('favoriteSubjects')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                rows={2}
                placeholder="Toán, Vật lý, Tiếng Anh..."
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            {error && (
               <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm mb-4">
                  {((error as unknown as ApiError | undefined)?.message) || "Đăng ký thất bại"}
               </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-slate-300"
            >
              {isPending ? 'Đang khởi tạo tài khoản...' : 'Tạo tài khoản học sinh'}
            </button>
            
            <p className="mt-6 text-center text-sm text-slate-500">
              Đã có tài khoản?{' '}
              <Link href={ROUTES.PUBLIC.LOGIN} className="font-semibold text-blue-600 hover:text-blue-700">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
