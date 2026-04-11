export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errorCode: string;
  path: string;
  timestamp: string;
  errors: ApiErrorField[];
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  role: string;
  userId: number;
}
