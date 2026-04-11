'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Clock, PlayCircle, Eye, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const mockQuiz = {
    id: params.id,
    title: 'Kiểm tra 15 phút Số Phức',
    timeLimitMinutes: 15,
    questions: [
      { id: 'q1', content: 'Căn bậc 2 của -1 là gì?', choices: [{ id: 'c1', content: 'i' }, { id: 'c2', content: '-i' }, { id: 'c3', content: '1' }, { id: 'c4', content: '-1' }] },
      { id: 'q2', content: 'Kí hiệu của tập hợp số phức?', choices: [{ id: 'c1', content: 'R' }, { id: 'c2', content: 'C' }, { id: 'c3', content: 'N' }, { id: 'c4', content: 'Z' }] },
    ],
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <PlayCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{mockQuiz.title}</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Thời gian làm bài: <span className="font-bold text-slate-700">{mockQuiz.timeLimitMinutes} phút</span>. Sau khi nhấn Bắt đầu, thời gian sẽ không thể dừng lại.
          </p>
          <div className="flex gap-3 justify-center">
             <button onClick={() => router.back()} className="px-6 py-3 border border-slate-200 text-slate-600 font-bold bg-white rounded-xl hover:bg-slate-50">
               Quay lại
             </button>
             <button onClick={() => setStarted(true)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md">
               Bắt đầu ngay
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between mb-8">
           <div>
             <h1 className="text-xl font-bold text-slate-800">{mockQuiz.title}</h1>
             <p className="text-sm text-slate-500">Câu hỏi 1 - {mockQuiz.questions.length}</p>
           </div>
           {submitted && <span className="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold border border-emerald-100 rounded-xl">Đã nộp bài</span>}
        </div>

        {mockQuiz.questions.map((q, idx) => (
          <div key={q.id} className="bg-white border border-slate-200 p-6 rounded-2xl">
            <div className="font-bold text-slate-800 mb-4 pb-4 border-b border-slate-100">
              <span className="text-blue-600 mr-2">Câu {idx + 1}:</span> {q.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.choices.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: c.id }))}
                  className={cn(
                    "p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3",
                    answers[q.id] === c.id ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                    submitted && "cursor-default ring-0 opacity-80"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    answers[q.id] === c.id ? "border-blue-600" : "border-slate-300"
                  )}>
                    {answers[q.id] === c.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                  <span className="text-sm font-medium">{c.content}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sticky top-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2 mb-2 p-3 bg-red-50 text-red-600 rounded-2xl w-full border border-red-100">
              <Clock size={20} />
              <span className="text-2xl font-black font-mono tracking-wider">{mockQuiz.timeLimitMinutes}:00</span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Thời gian còn lại</p>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-8">
            {mockQuiz.questions.map((q, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-xs font-bold border transition-colors",
                  answers[q.id] ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-500"
                )}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          {!submitted ? (
            <button
              onClick={handleSubmit} 
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all"
            >
              Nộp Bài Điểm Danh
            </button>
          ) : (
            <button
              onClick={() => router.back()} 
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all font-bold flex items-center justify-center gap-2"
            >
              Hoàn tất <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}