'use client';

import { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Lock, 
  Unlock, 
  UserPlus,
  ShieldCheck,
  Mail,
  Plus,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { Table, Tag, Space, Button, Input, Dropdown, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAdminUsers, useUpdateUserStatus } from '@/lib/query/hooks/useAdmin';
import { cn } from '@/lib/utils';

interface UserDataType {
  id: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export default function UserManagementPage() {
  const [searchText, setSearchText] = useState('');
  const { data: users, isLoading } = useAdminUsers({ search: searchText });
  const { mutate: updateStatus } = useUpdateUserStatus();

  const handleToggleStatus = (record: UserDataType) => {
    const newStatus = record.status === 'ACTIVE' ? false : true;
    updateStatus({ userId: record.id, active: newStatus }, {
       onSuccess: () => message.success('Cập nhật trạng thái thành công'),
    });
  };

  const columns: ColumnsType<UserDataType> = [
    {
      title: 'Họ và Tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div className="flex items-center gap-3 italic font-bold">
           <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] uppercase font-black">
              {text.charAt(0)}
           </div>
           <div>
              <p className="text-sm text-slate-800 leading-none mb-1">{text}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{record.id}</p>
           </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
         <span className="text-xs font-bold text-slate-500 italic flex items-center gap-2">
            <Mail size={12} /> {text}
         </span>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Học sinh', value: 'STUDENT' },
        { text: 'Giảng viên', value: 'TEACHER' },
        { text: 'Admin', value: 'ADMIN' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        const colors: any = {
           ADMIN: 'red',
           TEACHER: 'indigo',
           STUDENT: 'blue',
        };
        return (
          <Tag color={colors[role]} className="font-black text-[10px] uppercase tracking-widest border-none px-3 py-0.5 rounded-lg italic">
             {role}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div className="flex items-center gap-2">
           <div className={cn("w-1.5 h-1.5 rounded-full", status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500')} />
           <span className={cn("text-[10px] font-black uppercase tracking-tighter", status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-500')}>
              {status}
           </span>
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <span className="text-xs font-bold text-slate-400 italic">{date}</span>
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Dropdown 
          menu={{ 
            items: [
              { key: '1', label: 'Chi tiết hồ sơ', icon: <UserPlus size={14} /> },
              { 
                key: '2', 
                label: record.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa', 
                danger: record.status === 'ACTIVE',
                icon: record.status === 'ACTIVE' ? <Lock size={14} /> : <Unlock size={14} />,
                onClick: () => handleToggleStatus(record)
              },
            ] 
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreHorizontal size={18} className="text-slate-400" />} />
        </Dropdown>
      ),
    },
  ];

  const displayUsers = users || mockUsers;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 italic">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <ShieldCheck size={32} className="text-red-500" />
             Quản lý Người dùng
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Kiểm soát truy cập và phân quyền toàn hệ thống eduDev.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                 placeholder="Tìm theo tên, email..." 
                 value={searchText}
                 onChange={(e) => setSearchText(e.target.value)}
                 className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-[300px] shadow-sm font-bold"
              />
           </div>
           <Button type="primary" className="bg-slate-900 border-none h-[42px] px-6 rounded-xl font-bold hover:bg-slate-800 transition-all">
              <Plus size={18} className="mr-2" /> Thêm Admin
           </Button>
        </div>
      </div>

      {/* Stats Summary Table-wide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <div className="p-6 bg-white border border-slate-200 rounded-3xl text-center shadow-sm italic hover:border-indigo-200 transition-all cursor-default">
            <p className="text-2xl font-black text-slate-800">1.2K</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Học sinh</p>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-3xl text-center shadow-sm italic hover:border-indigo-200 transition-all cursor-default">
            <p className="text-2xl font-black text-slate-800">45</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Giảng viên</p>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-3xl text-center shadow-sm italic hover:border-indigo-200 transition-all cursor-default">
            <p className="text-2xl font-black text-emerald-600">89%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hoạt động</p>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-3xl text-center shadow-sm italic hover:border-indigo-200 transition-all cursor-default">
            <p className="text-2xl font-black text-red-500">03</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cảnh báo</p>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
         <Table 
           columns={columns} 
           dataSource={displayUsers} 
           loading={isLoading}
           rowKey="id"
           pagination={{ pageSize: 10, position: ['bottomCenter'] }}
           className="custom-antd-table italic"
         />
      </div>
    </div>
  );
}

const mockUsers: UserDataType[] = [
  { id: 'USR-001', fullName: 'Nguyễn Văn An', email: 'an.nv@gmail.com', role: 'ADMIN', status: 'ACTIVE', createdAt: '2024-01-10' },
  { id: 'USR-012', fullName: 'Lê Minh Hạnh', email: 'hanh.le@edudev.vn', role: 'TEACHER', status: 'ACTIVE', createdAt: '2024-02-15' },
  { id: 'USR-542', fullName: 'Trần Thế Minh', email: 'minh.tt@gmail.com', role: 'STUDENT', status: 'ACTIVE', createdAt: '2024-03-01' },
  { id: 'USR-891', fullName: 'Phạm Hồng Duy', email: 'duy.ph@gmail.com', role: 'STUDENT', status: 'INACTIVE', createdAt: '2024-03-05' },
  { id: 'USR-025', fullName: 'Ngô Bảo Châu', email: 'chau.nb@edudev.vn', role: 'TEACHER', status: 'ACTIVE', createdAt: '2024-02-20' },
];
