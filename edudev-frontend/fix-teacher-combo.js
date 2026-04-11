const fs = require('fs');
const file = 'src/app/(teacher)/teacher/combos/build/page.tsx';
let data = fs.readFileSync(file, 'utf-8');

data = data.replace(
  `                           {/* Using static mock topics for demonstration if sub-topics are missing */}
                           {['Cực trị hàm số', 'Đạo hàm bậc cao', 'Tích phân từng phần'].map((tName, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => toggleTopic(\`\${subject.id}-\${i}\`)}
                                className={cn(
                                   "flex items-center justify-between p-4 rounded-2xl border text-sm font-bold transition-all",
                                   selectedTopics.includes(\`\${subject.id}-\${i}\`) 
                                     ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                                     : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                                )}
                              >
                                <span>{tName}</span>
                                {selectedTopics.includes(\`\${subject.id}-\${i}\`) && <CheckCircle size={16} className="text-indigo-500" />}
                              </button>
                           ))}`,
  `                           {subject.topics && subject.topics.length > 0 ? subject.topics.map((topic: any) => (
                              <button
                                key={topic.id}
                                type="button"
                                onClick={() => toggleTopic(\`\${subject.id}-\${topic.id}\`)}
                                className={cn(
                                   "flex items-center justify-between p-4 rounded-2xl border text-sm font-bold transition-all",
                                   selectedTopics.includes(\`\${subject.id}-\${topic.id}\`) 
                                     ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                                     : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                                )}
                              >
                                <span>{topic.name}</span>
                                {selectedTopics.includes(\`\${subject.id}-\${topic.id}\`) && <CheckCircle size={16} className="text-indigo-500" />}
                              </button>
                           )) : (
                              <div className="text-xs text-slate-400 font-bold italic col-span-full">Chưa có chủ đề nào trong môn này.</div>
                           )}`
);

fs.writeFileSync(file, data);
