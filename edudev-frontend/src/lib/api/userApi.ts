import { getRequest, putRequest } from './apiClient';
import type { User } from '@/store/authStore';

export interface StudentProfile extends User {
  grade?: string;
  targetExamYear?: number;
  interestedMajors?: string;
  favoriteSubjects?: string;
}

export interface TeacherProfile extends User {
  specialization?: string;
  yearsOfExperience?: number;
  bio?: string;
}

export interface UpdateStudentProfilePayload {
  fullName: string;
  avatarUrl?: string;
  grade?: string;
  targetExamYear?: number;
  interestedMajors?: string;
  favoriteSubjects?: string;
}

export interface UpdateTeacherProfilePayload {
  fullName: string;
  avatarUrl?: string;
  specialization?: string;
  yearsOfExperience?: number;
  bio?: string;
}

export const userApi = {
  getMe: () => getRequest<User>('/users/me'),
  getStudentProfile: () => getRequest<StudentProfile>('/students/me/profile'),
  getTeacherProfile: () => getRequest<TeacherProfile>('/teachers/me/profile'),
  updateStudentProfile: (data: UpdateStudentProfilePayload) =>
    putRequest<StudentProfile>('/students/me/profile', data),
  updateTeacherProfile: (data: UpdateTeacherProfilePayload) =>
    putRequest<TeacherProfile>('/teachers/me/profile', data),
};
