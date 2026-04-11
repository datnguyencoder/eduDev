import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import type { ApiEnvelope, ApiError } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export function getRequest<T>(...args: Parameters<typeof apiClient.get>) {
  return apiClient.get(...args) as unknown as Promise<T>;
}

export function postRequest<T>(...args: Parameters<typeof apiClient.post>) {
  return apiClient.post(...args) as unknown as Promise<T>;
}

export function putRequest<T>(...args: Parameters<typeof apiClient.put>) {
  return apiClient.put(...args) as unknown as Promise<T>;
}

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiEnvelope<unknown>;
    return payload?.data ?? response.data;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Logging out...");
      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined') {
         window.location.href = '/login';
      }
    }

    const apiError = error.response?.data as ApiError | undefined;
    return Promise.reject(apiError ?? error);
  }
);
