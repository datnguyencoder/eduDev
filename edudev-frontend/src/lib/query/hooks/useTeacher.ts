import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '@/lib/api/teacherApi';

export function useTeacherStats() {
  return useQuery({
    queryKey: ['teacher', 'stats'],
    queryFn: () => teacherApi.getStats(),
  });
}

export function useManagedContent() {
  return useQuery({
    queryKey: ['teacher', 'content'],
    queryFn: () => teacherApi.getManagedContent(),
  });
}

export function useAssignedStudents() {
  return useQuery({
    queryKey: ['teacher', 'students'],
    queryFn: () => teacherApi.getAssignedStudents(),
  });
}

export function useSubmitForReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: string; id: string }) => {
      if (type === 'QUIZ') return teacherApi.submitQuizForReview(id);
      if (type === 'COMBO') return teacherApi.submitComboForReview(id);
      return teacherApi.submitLessonForReview(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'content'] });
    },
  });
}
