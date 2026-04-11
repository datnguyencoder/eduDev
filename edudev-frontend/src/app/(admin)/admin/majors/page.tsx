'use client';

import { useState } from 'react';
import { 
  BookMarked, 
  Search, 
  Plus, 
  TrendingUp, 
  Briefcase, 
  Target, 
  Edit3, 
  Trash2, 
  History,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { Table, Tag, Button, Input, Space, Dropdown, message, Modal, Form, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMajors } from '@/lib/query/hooks/useMajors';
import { cn } from '@/lib/utils';
import type { Major } from '@/lib/api/majorApi';

interface MajorDataType {
  id: string;
  name: string;
  code: string;
  admissionSubjects: string[];
  salaryRange: string;
  marketTrend: 'growing' | 'stable' | 'declining';
}

export default function AdminMajorsPage() {
  const [searchText, setSearchText] = useState('');
  const { data: majors, isLoading } = useMajors({ search: searchText });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<MajorDataType> = [
    {
      title: 'Ngành học',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="italic font-bold">
           <p className="text-sm text-slate-800 leading-none mb-1">{text}</p>
           <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{record.code}</p>
        </div>
      ),
    },
    {
      title: 'Khối thi xét tuyển',
      dataIndex: 'admissionSubjects',
      key: 'admissionSubjects',
      render: (subs: string[]) => (
        <div className="flex flex-wrap gap-1">
           {subs?.map(s => <Tag key={s} className="bg-slate-50 border-slate-100 text-[9px] font-black text-slate-400 rounded uppercase">{s}</Tag>)}
        </div>
      )
    },
    {
      title: 'Xu hướng',
      dataIndex: 'marketTrend',
      key: 'marketTrend',
      render: (trend) => {
        const configs: any = {
           growing: { label: 'Tăng trưởng', color: 'emerald', icon: <TrendingUp size={12} /> },
           stable: { label: 'Ổn định', color: 'blue', icon: <History size={12} /> },
           declining: { label: 'Giảm nhẹ', color: 'red', icon: <XCircle size={12} /> },
        };
        const config = configs[trend];
        return (
          <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase italic border", 
             trend === 'growing' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
             trend === 'stable' ? 'bg-blue-50 text-blue-600 border-blue-100' :
             'bg-red-50 text-red-600 border-red-100'
          )}>
             {config.icon} {config.label}
          </div>
        );
      }
    },
    {
      title: 'Lương trung bình',
      dataIndex: 'salaryRange',
      key: 'salaryRange',
      render: (val) => <span className="text-xs font-bold text-slate-800 italic">{val}</span>
    },
    {
      title: '',
      key: 'action',
      render: (_) => (
        <Space size="middle">
          <Button type="text" icon={<Edit3 size={16} className="text-slate-400" />} />
          <Button type="text" danger icon={<Trash2 size={16} />} />
        </Space>
      ),
    },
  ];

  const displayMajors: MajorDataType[] = majors
    ? majors.map((major: Major) => ({
        id: String(major.id),
        name: major.name,
        code: major.code,
        admissionSubjects: [],
        salaryRange: 'Đang cập nhật',
        marketTrend: 'stable',
      }))
    : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 italic">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <BookMarked size={32} className="text-indigo-600" />
             Thư viện Ngành/Nghề
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Quản lý cơ sở dữ liệu các ngành học và gợi ý tư vấn nghề nghiệp.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                 placeholder="Tìm ngành, mã ngành..." 
                 value={searchText}
                 onChange={(e) => setSearchText(e.target.value)}
                 className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-[240px] shadow-sm font-bold"
              />
           </div>
           <Button 
             type="primary" 
             onClick={() => setIsModalOpen(true)}
             className="bg-indigo-600 border-none h-[42px] px-6 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/10 italic"
           >
              <Plus size={18} className="mr-2" /> Thêm Ngành mới
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
               <Briefcase size={24} />
            </div>
            <div>
               <p className="text-2xl font-black text-slate-800 leading-none">520+</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ngành đào tạo</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
               <TrendingUp size={24} />
            </div>
            <div>
               <p className="text-2xl font-black text-slate-800 leading-none">12</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ngành HOT tháng này</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-blue-300 transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
               <Target size={24} />
            </div>
            <div>
               <p className="text-2xl font-black text-slate-800 leading-none">8.2</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Điểm khớp Trung bình</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
         <Table 
           columns={columns} 
           dataSource={displayMajors} 
           loading={isLoading}
           rowKey="id"
           pagination={{ pageSize: 10, position: ['bottomCenter'] }}
           className="custom-antd-table italic"
         />
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        title={<span className="text-xl font-black text-slate-800 tracking-tight italic">Cài đặt Ngành học</span>} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
        className="custom-antd-modal italic"
      >
         <Form form={form} layout="vertical" className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-6">
               <Form.Item name="name" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Tên ngành học</span>} required>
                  <Input placeholder="VD: Khoa học Máy tính" className="rounded-xl py-2 font-bold focus:ring-2 focus:ring-indigo-500/10" />
               </Form.Item>
               <Form.Item name="code" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Mã ngành</span>} required>
                  <Input placeholder="VD: 7480101" className="rounded-xl py-2 font-bold focus:ring-2 focus:ring-indigo-500/10 font-mono" />
               </Form.Item>
            </div>

            <Form.Item name="targetMajorId" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Khối thi xét tuyển (Multi-select)</span>}>
               <Select mode="multiple" className="w-full" placeholder="Chọn các khối thi..." options={[{value:'A00', label:'A00'}, {value:'A01', label:'A01'}, {value:'D01', label:'D01'}]} />
            </Form.Item>

            <Form.Item name="description" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Mô tả chi tiết và Cơ hội nghề nghiệp</span>}>
               <Input.TextArea rows={4} className="rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-500/10" />
            </Form.Item>

            <div className="flex justify-end gap-3 pt-6">
               <Button onClick={() => setIsModalOpen(false)} className="h-[42px] px-8 rounded-xl font-black uppercase text-[10px] tracking-widest border border-slate-200">Hủy</Button>
               <Button type="primary" className="bg-indigo-600 h-[42px] px-10 rounded-xl font-black uppercase text-[10px] tracking-widest border-none shadow-xl shadow-indigo-500/20">Lưu thông tin</Button>
            </div>
         </Form>
      </Modal>
    </div>
  );
}


