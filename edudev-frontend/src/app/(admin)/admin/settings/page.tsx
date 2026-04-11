'use client';

import { 
  Settings, 
  Database, 
  ShieldAlert, 
  BellRing, 
  Server, 
  BrainCircuit, 
  Save, 
  PlayCircle,
  Clock,
  Zap,
  ChevronRight,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Form, Input, Switch, Select, Button, message, Slider, Space, Divider } from 'antd';

export default function AdminSettingsPage() {
  const [form] = Form.useForm();

  const handleSave = (values: any) => {
    console.log('Save Settings:', values);
    message.success('Cài đặt hệ thống đã được cập nhật thành công');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 italic">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Settings size={32} className="text-indigo-600" />
             Cấu hình Hệ thống
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Thiết lập các tham số vận hành, AI và bảo mật cho toàn bộ eduDev.</p>
        </div>
        <Button 
          type="primary" 
          onClick={() => form.submit()}
          className="bg-slate-900 border-none h-[42px] px-8 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
        >
           <Save size={18} className="mr-2" /> Lưu thay đổi
        </Button>
      </div>

      <Form 
        form={form} 
        onFinish={handleSave}
        layout="vertical"
        initialValues={{
          aiStrictness: 75,
          allowTeacherRegistration: true,
          enableAutoModeration: false,
          notificationFrequency: 'REALTIME',
          maintenanceMode: false
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Sidebar Navigation for Settings */}
           <div className="md:col-span-1 space-y-2">
              <SettingsNavItem icon={<BrainCircuit size={18} />} label="Tham số AI & Core" active />
              <SettingsNavItem icon={<ShieldAlert size={18} />} label="Bảo mật & Phân quyền" />
              <SettingsNavItem icon={<BellRing size={18} />} label="Thông báo & Email" />
              <SettingsNavItem icon={<Server size={18} />} label="Hạ tầng & CSDL" />
              <SettingsNavItem icon={<Zap size={18} />} label="Dịch vụ bên thứ 3" />
           </div>

           {/* Content Area */}
           <div className="md:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                 {/* AI Configuration Section */}
                 <section className="space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                       <BrainCircuit size={18} className="text-indigo-600" /> Cấu hình Trí tuệ Nhân tạo
                    </h3>
                    <div className="space-y-8">
                       <Form.Item label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Độ chính xác của Recommendation (%)</span>} name="aiStrictness">
                          <Slider 
                             marks={{ 0: 'Tự do', 50: 'Cân bằng', 100: 'Khắt khe' }} 
                             className="mt-6 mb-10"
                          />
                       </Form.Item>
                       <Form.Item 
                          label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tự động duyệt nội dung (Auto-Moderation)</span>} 
                          name="enableAutoModeration" 
                          valuePropName="checked"
                          className="flex items-center justify-between"
                       >
                          <Switch className="bg-slate-200" />
                       </Form.Item>
                    </div>
                 </section>

                 <Divider />

                 {/* Access Policy Section */}
                 <section className="space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                       <ShieldAlert size={18} className="text-red-500" /> Chính sách Truy cập học thuật
                    </h3>
                    <div className="space-y-6">
                       <Form.Item 
                          label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Cho phép Giáo viên đăng ký thủ công</span>} 
                          name="allowTeacherRegistration" 
                          valuePropName="checked"
                       >
                          <Switch />
                       </Form.Item>
                       <Form.Item 
                          label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Giới hạn số lần làm Quiz mỗi ngày</span>} 
                          name="quizLimit"
                       >
                          <Select className="w-full" options={[
                             { value: 5, label: 'Tối đa 5 lần' },
                             { value: 10, label: 'Tối đa 10 lần' },
                             { value: 0, label: 'Không giới hạn' },
                          ]} />
                       </Form.Item>
                    </div>
                 </section>
              </div>

              {/* Maintenance Message Card */}
              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-900/10">
                 <div className="flex items-start justify-between mb-8">
                    <div className="space-y-1">
                       <h4 className="font-bold flex items-center gap-2 italic">
                          <Server size={18} className="text-indigo-400" /> Chế độ Bảo trì (Maintenance)
                       </h4>
                       <p className="text-[10px] text-slate-400 font-medium italic">Tạm ngừng truy cập toàn bộ hệ thống EDU cho học sinh.</p>
                    </div>
                    <Form.Item name="maintenanceMode" valuePropName="checked" className="mb-0">
                       <Switch className="bg-white/10" />
                    </Form.Item>
                 </div>
                 <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông báo hiển thị</span>}>
                    <Input.TextArea 
                       rows={2} 
                       className="bg-white/5 border-white/10 text-white text-sm rounded-xl placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500"
                       placeholder="Hệ thống đang được nâng cấp..." 
                    />
                 </Form.Item>
              </div>
           </div>
        </div>
      </Form>
    </div>
  );
}

function SettingsNavItem({ icon, label, active = false }: any) {
  return (
    <button className={cn(
       "w-full flex items-center gap-3 p-4 rounded-xl text-left text-sm font-bold transition-all border italic",
       active 
         ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20" 
         : "bg-white text-slate-500 border-slate-100 hover:border-indigo-200"
    )}>
       <span className={cn(active ? 'text-white' : 'text-slate-400')}>{icon}</span>
       <span>{label}</span>
       {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
  );
}
