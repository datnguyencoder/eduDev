import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi, AnswerSubmission } from '@/lib/api/quizApi';

export function useQuizDetail(quizId: string | number) {
  return useQuery({
    queryKey: ['quizzes', quizId],
    queryFn: () => quizApi.getQuiz(quizId),
    enabled: !!quizId,
  });
}

export function useSubmitQuizAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, answers }: { quizId: string | number; answers: AnswerSubmission[] }) => 
      quizApi.submitAttempt(quizId, answers),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', variables.quizId] });
      // Can invalidate other lists if needed
    },
  });
}
