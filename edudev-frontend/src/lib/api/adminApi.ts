import { getRequest, postRequest } from './apiClient';

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalLessons: number;
  totalQuizzes: number;
  totalEnrollments: number;
  totalQuizAttempts: number;
  pendingReviews: number;
}

export interface ModerationItem {
  id: number;
  title: string;
  creatorId: number;
  creatorName: string;
  type: 'LESSON' | 'QUIZ' | 'COMBO';
  updatedAt: string;
}

export interface AdminUserRow {
  id: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export const adminApi = {
  async getStats(): Promise<AdminStats> {
    const stats = await getRequest<{
      totalStudents: number;
      totalTeachers: number;
      totalLessons: number;
      totalQuizzes: number;
      totalEnrollments: number;
      totalQuizAttempts: number;
    }>('/admin/dashboard');
    const queue = await getRequest<ModerationItem[]>('/admin/content-reviews');

    return {
      ...stats,
      pendingReviews: queue.length,
    };
  },
  getModerationQueue: () => getRequest<ModerationItem[]>('/admin/content-reviews'),
  approveContent: (id: string, type: ModerationItem['type']) =>
    postRequest(`/admin/content-reviews/${id}/approve`, { type }),
  rejectContent: (id: string, type: ModerationItem['type'], note: string) =>
    postRequest(`/admin/content-reviews/${id}/reject`, { type, note }),
  getUsers: async (_params?: Record<string, string>): Promise<AdminUserRow[]> => [],
  updateUserStatus: async (_userId: string, _active: boolean): Promise<void> => {},
};
