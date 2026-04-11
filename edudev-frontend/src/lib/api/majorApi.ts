import { getRequest, postRequest } from './apiClient';

export interface Major {
  id: number;
  name: string;
  code: string;
  description?: string;
  groupName?: string;
  createdAt?: string;
  admissionSubjects?: string[];
  salaryRange?: string;
  marketTrend?: 'growing' | 'stable' | 'declining';
  careerPaths?: string[];
  suggestedSubjects?: string[];
  fitnessScore?: number;
  aiAdvice?: string;
}

export interface RecommendationResponse {
  id: number;
  studentId: number;
  suggestedMajorId: number;
  suggestedMajorName: string;
  suggestedMajorCode: string;
  reasoning: string;
  confidenceScore: number;
  isSaved: boolean;
  createdAt: string;
}

export interface WishlistMajor {
  id: number;
  majorId: number;
  majorCode: string;
  majorName: string;
  priority: number;
}

export const majorApi = {
  getMajors: (params?: { group?: string; search?: string }) => getRequest<Major[]>('/majors', { params }),
  getMajorDetail: (id: string) => getRequest<Major>(`/majors/${id}`),
  getRecommendations: () => getRequest<RecommendationResponse[]>('/recommendations/me'),
  recalculateRecommendations: (payload?: { interests?: string; strengths?: string }) =>
    postRequest<RecommendationResponse>('/recommendations/recalculate', payload ?? {}),
  getWishlist: () => getRequest<WishlistMajor[]>('/users/me/wishlist-majors'),
  toggleWishlist: async (majorId: string) =>
    postRequest<WishlistMajor[]>('/users/me/wishlist-majors', { majorId: Number(majorId) }),
};
