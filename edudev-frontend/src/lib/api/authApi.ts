import { ROLE } from '@/lib/constants/routes';
import { getRequest, postRequest } from './apiClient';
import type { AuthPayload } from './types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterStudentRequest {
  email: string;
  password: string;
  fullName: string;
  grade?: string;
  targetExamYear?: number;
}

export interface CurrentUserResponse {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: ROLE;
    avatarUrl?: string;
  };
}

function toRole(role: string): ROLE {
  switch (role) {
    case ROLE.ADMIN:
      return ROLE.ADMIN;
    case ROLE.TEACHER:
      return ROLE.TEACHER;
    default:
      return ROLE.STUDENT;
  }
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const auth = await postRequest<AuthPayload>('/auth/login', credentials);
    const user = await getRequest<CurrentUserResponse>('/users/me', {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });

    return {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      user: {
        id: String(user.id),
        email: user.email,
        fullName: user.fullName,
        role: toRole(user.role),
        avatarUrl: user.avatarUrl,
      },
    };
  },

  registerStudent: (data: RegisterStudentRequest) =>
    postRequest<AuthPayload>('/auth/register/student', data),

  getCurrentUser: () => getRequest<CurrentUserResponse>('/users/me'),

  logout: (refreshToken: string) =>
    postRequest<void>('/auth/logout', { refreshToken }),
};
