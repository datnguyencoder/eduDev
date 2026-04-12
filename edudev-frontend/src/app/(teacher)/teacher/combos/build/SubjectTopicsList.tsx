import { useSubjectTopics } from '@/lib/query/hooks/useSubjects';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export function SubjectTopicsList({ subjectId, selectedTopics, toggleTopic }: { subjectId: string; selectedTopics: string[]; toggleTopic: (id: string) => void }) {
  const { data: topics, isLoading } = useSubjectTopics(subjectId);

  if (isLoading) return <div className="text-xs text-slate-400">Đang tải chủ đề...</div>;
  if (!topics || topics.length === 0) return <div className="text-xs text-slate-400">Không có chủ đề nào.</div>;

  return (
    <>
      {topics.map((topic) => (
        <button
          key={topic.id}
          type="button"
          onClick={() => toggleTopic(topic.id.toString())}
          className={cn(
            "flex items-center justify-between p-4 rounded-2xl border text-sm font-bold transition-all",
            selectedTopics.includes(topic.id.toString())
              ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
              : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
          )}
        >
          <span className="truncate">{topic.name}</span>
          {selectedTopics.includes(topic.id.toString()) && <CheckCircle2 size={16} className="text-indigo-600" />}
        </button>
      ))}
    </>
  );
}
