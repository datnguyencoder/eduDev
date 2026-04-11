'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Target, 
  BrainCircuit, 
  Users, 
  LineChart, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">e</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">eduDev</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Tính năng</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Cách hoạt động</a>
            <a href="#recommendation" className="hover:text-blue-600 transition-colors">AI Hướng nghiệp</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href={ROUTES.PUBLIC.LOGIN} className="text-sm font-medium text-slate-600 hover:text-blue-600 px-4 py-2 transition-colors">
              Đăng nhập
            </Link>
            <Link 
              href={ROUTES.PUBLIC.REGISTER} 
              className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-sm active:scale-95"
            >
              Tham gia ngay
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-blue-700 uppercase bg-blue-50 rounded-full">
              Nền tảng học tập & hướng nghiệp toàn diện
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
              Định hướng tương lai bằng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Trí tuệ Nhân tạo</span>
            </h1>
            <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Hệ thống học tập thông minh giúp học sinh THPT nắm vững kiến thức, 
              vượt qua các kỳ thi và tìm ra ngành học phù hợp nhất với năng lực bản thân.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href={ROUTES.PUBLIC.REGISTER} 
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                Bắt đầu học ngay <ArrowRight size={20} />
              </Link>
              <Link 
                href="#features" 
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-lg text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative px-4"
          >
             <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400" />
                   <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400">
                   {/* Placeholder for real image or content dashboard demo */}
                   <div className="text-center p-8">
                      <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                         <BrainCircuit size={40} className="text-blue-500" />
                      </div>
                      <h3 className="text-slate-600 font-medium italic">Giao diện Dashboard Học sinh</h3>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">Giải pháp toàn diện cho giáo dục</h2>
            <p className="mt-4 text-lg text-slate-500">Tích hợp đầy đủ các công cụ cần thiết cho cả người học và người dạy.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: <BookOpen />, 
                title: "Thư viện bài giảng", 
                desc: "Hệ thống bài học đa dạng theo từng khối lớp và môn học, được biên soạn kỹ lưỡng." 
              },
              { 
                icon: <Target />, 
                title: "Luyện tập & Quiz", 
                desc: "Kho câu hỏi trắc nghiệm phong phú, chấm điểm tự động và giải thích chi tiết." 
              },
              { 
                icon: <BrainCircuit />, 
                title: "AI Hướng nghiệp", 
                desc: "Gợi ý ngành học và combo môn học dựa trên kết quả học tập và sở thích cá nhân." 
              },
              { 
                icon: <Users />, 
                title: "Quản lý lớp học", 
                desc: "Giúp giáo viên dễ dàng theo dõi tiến độ và hỗ trợ học sinh hiệu quả hơn." 
              },
              { 
                icon: <LineChart />, 
                title: "Phân tích số liệu", 
                desc: "Biểu đồ trực quan giúp học sinh và phụ huynh nắm bắt được sự tiến bộ theo thời gian." 
              },
              { 
                icon: <CheckCircle2 />, 
                title: "Kiểm duyệt nội dung", 
                desc: "Quy trình review nghiêm ngặt đảm bảo chất lượng giáo dục ở mức cao nhất." 
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Role-based Benefits */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-8 leading-tight">
                Thiết kế riêng cho từng nhu cầu
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold italic">S</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Cho Học sinh</h4>
                    <p className="text-slate-500 text-sm">Học tập theo lộ trình cá nhân hóa, làm quiz thử sức và xem gợi ý chọn ngành đại học phù hợp.</p>
                  </div>
                </div>
                
                <div className="flex gap-5">
                   <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold italic">T</div>
                   <div>
                     <h4 className="text-lg font-bold text-slate-800 mb-1">Cho Giáo viên</h4>
                     <p className="text-slate-500 text-sm">Công cụ soạn thảo bài giảng và xây dựng đề thi chuyên nghiệp, theo dõi sát sao học sinh được phân công.</p>
                   </div>
                </div>
                
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold italic">A</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Cho Admin</h4>
                    <p className="text-slate-500 text-sm">Quản lý toàn bộ hệ thống, từ người dùng đến chất lượng nội dung và báo cáo phân tích chiến lược.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex items-center gap-6 p-6 border border-blue-100 bg-blue-50/30 rounded-2xl">
                 <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                    <BrainCircuit size={20} className="text-white" />
                 </div>
                 <div>
                    <p className="text-sm font-medium text-slate-700">"Hệ thống đã giúp 85% học sinh cải thiện kết quả học tập sau 3 tháng."</p>
                 </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="relative lg:pl-10"
            >
               <div className="w-full aspect-square md:aspect-auto md:h-[500px] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Decorative background or actual app screenshot */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                     <div className="relative p-10 bg-white rounded-2xl shadow-xl w-4/5 transform rotate-3">
                        <div className="flex justify-between items-center mb-6">
                           <div className="h-4 w-32 bg-slate-100 rounded" />
                           <div className="h-8 w-8 bg-blue-50 rounded-full" />
                        </div>
                        <div className="space-y-3">
                           <div className="h-3 w-full bg-slate-50 rounded" />
                           <div className="h-3 w-4/5 bg-slate-50 rounded" />
                           <div className="h-3 w-2/3 bg-slate-50 rounded" />
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                           <div className="h-16 bg-blue-50 rounded-xl" />
                           <div className="h-16 bg-slate-50 rounded-xl" />
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">e</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">eduDev</span>
              </div>
              <p className="text-sm leading-relaxed">
                Kiến tạo tương lai số thông qua giáo dục và định hướng nghề nghiệp bằng công nghệ.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Sản phẩm</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Bài giảng</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Quiz luyện tập</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Tư vấn chọn ngành</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Dashboard AI</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Học sinh</h4>
              <ul className="space-y-4 text-sm">
                <li><a href={ROUTES.PUBLIC.LOGIN} className="hover:text-blue-500 transition-colors">Đăng nhập</a></li>
                <li><a href={ROUTES.PUBLIC.REGISTER} className="hover:text-blue-500 transition-colors">Tạo tài khoản</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Hướng dẫn sử dụng</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Cộng đồng</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Liên kết</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Liên hệ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm">© 2026 eduDev. All rights reserved.</p>
            <div className="flex gap-8">
              {/* Social icons placeholder */}
              <div className="w-5 h-5 bg-slate-800 rounded-full" />
              <div className="w-5 h-5 bg-slate-800 rounded-full" />
              <div className="w-5 h-5 bg-slate-800 rounded-full" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
