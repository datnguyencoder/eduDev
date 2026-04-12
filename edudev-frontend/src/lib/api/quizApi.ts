import { getRequest, postRequest } from './apiClient';

export interface Choice {
  id: number;
  content: string;
  isCorrect?: boolean;
  displayOrder?: number;
}

export interface Question {
  id: number;
  content: string;
  explanation?: string;
  point?: number;
  displayOrder?: number;
  choices?: Choice[];
}

export interface QuizDetail {
  id: number;
  lessonId?: number;
  creatorId?: number;
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  passingScore?: number;
  status?: string;
  questions?: Question[];
}

export interface AnswerSubmission {
  questionId: number;
  choiceId: number;
}

export interface SubmitAttemptRequest {
  answers: AnswerSubmission[];
}

export interface AttemptResponse {
  id: number;
  quizId: number;
  userId: number;
  score: number;
  completedAt: string;
  passed: boolean;
}

export const quizApi = {
  getQuiz: (id: string | number) => getRequest<QuizDetail>(`/quizzes/${id}`),
  submitAttempt: (id: string | number, answers: AnswerSubmission[]) => 
    postRequest<AttemptResponse>(`/quizzes/${id}/attempts`, { answers }),
};
