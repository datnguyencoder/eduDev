'use client';

import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  PlayCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Mock data for the chart
const data = [
  { name: 'T2', score: 65 },
  { name: 'T3', score: 59 },
  { name: 'T4', score: 80 },
  { name: 'T5', score: 81 },
  { name: 'T6', score: 56 },
  { name: 'T7', score: 95 },
  { name: 'CN', score: 88 },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chào buổi chiều, Nguyễn Văn A 👋</h1>
        <p className="text-slate-500 mt-1">Hôm nay bạn có 2 bài học mới và 1 quiz đang chờ.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<BookOpen size={20} />} 
          label="Bài học hoàn thành" 
          value="12/48" 
          trend="+2 tuần này" 
          color="blue" 
        />
        <StatCard 
          icon={<Trophy size={20} />} 
          label="Điểm Quiz trung bình" 
          value="8.5" 
          trend="+0.3 so với tháng trước" 
          color="emerald" 
        />
        <StatCard 
          icon={<Clock size={20} />} 
          label="Thời gian học tập" 
          value="24h 15m" 
          trend="Duy trì đều đặn" 
          color="amber" 
        />
        <StatCard 
          icon={<TrendingUp size={20} />} 
          label="Độ phù hợp ngành nghề" 
          value="92%" 
          trend="Dựa trên AI phân tích" 
          color="indigo" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Hiệu suất học tập hàng tuần</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-600 focus:ring-0 cursor-pointer">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Lessons */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Tiếp tục học</h3>
           <div className="space-y-4">
              <LessonItem 
                title="Đạo hàm và ứng dụng" 
                subject="Toán học" 
                progress={75} 
                image="math"
              />
              <LessonItem 
                title="Sóng cơ và Sóng âm" 
                subject="Vật lý" 
                progress={30} 
                image="physics"
              />
              <LessonItem 
                title="Di truyền học quần thể" 
                subject="Sinh học" 
                progress={10} 
                image="biology"
              />
           </div>
           <button className="w-full mt-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
              Xem tất cả bài học <ArrowUpRight size={16} />
           </button>
        </div>
      </div>

      {/* AI Recommendation Section Mini */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
         <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-2">Ngành Khoa học Máy tính đang rất phù hợp với bạn!</h2>
            <p className="text-blue-100 opacity-90">
               Dựa trên điểm số môn Toán (9.5) và kết quả Quiz gần đây, AI gợi ý bạn nên tìm hiểu thêm về nhóm ngành Công nghệ Thông tin.
            </p>
         </div>
         <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-white/20 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95">
            Xem phân tích chi tiết <TrendingUp size={20} />
         </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
      </div>
      <p className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
        {trend}
      </p>
    </div>
  );
}

function LessonItem({ title, subject, progress, image }: any) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
      <div className="relative w-16 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
         <PlayCircle size={24} className="group-hover:text-blue-500 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="text-sm font-bold text-slate-800 truncate leading-none mb-1">{title}</h5>
        <p className="text-xs text-slate-500">{subject}</p>
        <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full bg-blue-500 rounded-full" style={{width: `${progress}%`}} />
        </div>
      </div>
      <div className="text-[10px] font-bold text-blue-600">{progress}%</div>
    </div>
  );
}
