import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectApi } from '@/lib/api/subjectApi';

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectApi.getSubjects(),
  });
}

export function useSubjectTopics(subjectId: string) {
  return useQuery({
    queryKey: ['subjects', subjectId, 'topics'],
    queryFn: () => subjectApi.getSubjectTopics(subjectId),
    enabled: !!subjectId,
  });
}

export function useTopicsBySubject(subjectId: string) {
  return useSubjectTopics(subjectId);
}

export function useTopicLessons(topicId: string) {
  return useQuery({
    queryKey: ['topics', topicId, 'lessons'],
    queryFn: () => subjectApi.getTopicLessons(topicId),
    enabled: !!topicId,
  });
}

export function useLessonDetail(lessonId: string) {
  return useQuery({
    queryKey: ['lessons', lessonId],
    queryFn: () => subjectApi.getLessonDetail(lessonId),
    enabled: !!lessonId,
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) => subjectApi.completeLesson(lessonId),
    onSuccess: (_, lessonId) => {
      // Refresh queries to show updated progress
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}
