import { getRequest, postRequest } from './apiClient';

export interface Subject {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  displayOrder?: number;
  createdAt?: string;
}

export interface Topic {
  id: number;
  name: string;
  description?: string;
  subjectId: number;
  displayOrder?: number;
  createdAt?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  topicId: number;
  title: string;
  content?: string;
  summary?: string;
  difficulty?: string;
  estimatedMinutes?: number;
  status?: string;
  isCompleted?: boolean;
}

export const subjectApi = {
  getSubjects: () => getRequest<Subject[]>('/subjects'),
  getSubjectTopics: (subjectId: string) => getRequest<Topic[]>(`/subjects/${subjectId}/topics`),
  getTopicLessons: (topicId: string) => getRequest<Lesson[]>(`/topics/${topicId}/lessons`),
  getLessonDetail: (lessonId: string) => getRequest<Lesson>(`/lessons/${lessonId}`),
  completeLesson: (lessonId: string) => postRequest<void>(`/lessons/${lessonId}/complete`),
};
