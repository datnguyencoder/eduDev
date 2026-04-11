import { getRequest, postRequest } from './apiClient';

export interface TeacherAssignment {
  id: number;
  teacherId: number;
  teacherName: string;
  targetId: number;
  targetName: string;
  assignedAt: string;
  status: string;
}

export interface TeacherFeedback {
  id: number;
  teacherId: number;
  teacherName: string;
  studentId: number;
  studentName: string;
  lessonId?: number;
  lessonTitle?: string;
  content: string;
  rating?: number;
  createdAt: string;
}

export interface TeacherStudentDashboard {
  studentId: number;
  studentName: string;
  totalFeedbacks: number;
  feedbacks: TeacherFeedback[];
}

export interface TeacherStats {
  totalLessons: number;
  totalQuizzes: number;
  totalCombos: number;
  activeStudents: number;
  pendingReviews: number;
  totalFeedbacks: number;
}

export interface ManagedContent {
  id: string;
  title: string;
  type: 'LESSON' | 'QUIZ' | 'COMBO';
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  updatedAt: string;
}

export const teacherApi = {
  async getStats(): Promise<TeacherStats> {
    const students = await getRequest<TeacherAssignment[]>('/teachers/my-students');
    return {
      totalLessons: 0,
      totalQuizzes: 0,
      totalCombos: 0,
      activeStudents: students.length,
      pendingReviews: 0,
      totalFeedbacks: 0,
    };
  },
  getManagedContent: async (): Promise<ManagedContent[]> => [],
  getAssignedStudents: () => getRequest<TeacherAssignment[]>('/teachers/my-students'),
  submitLessonForReview: (id: string) => postRequest(`/teacher/lessons/${id}/submit-review`),
  submitQuizForReview: (id: string) => postRequest(`/teacher/quizzes/${id}/submit-review`),
  submitComboForReview: (id: string) => postRequest(`/teacher/combos/${id}/submit-review`),
  createFeedback: (payload: { studentId: number; lessonId?: number; content: string; rating?: number }) =>
    postRequest<TeacherFeedback>('/teacher/feedbacks', payload),
  getStudentDashboard: (studentId: string) =>
    getRequest<TeacherStudentDashboard>(`/teacher/students/${studentId}/dashboard`),
};
