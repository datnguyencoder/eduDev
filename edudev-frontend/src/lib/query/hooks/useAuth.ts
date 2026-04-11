import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, type LoginCredentials, type RegisterStudentRequest } from '@/lib/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { ROLE, ROUTES } from '@/lib/constants/routes';

export function useLogin() {
  const router = useRouter();
  const { setCredentials } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setCredentials(data.user, data.accessToken, data.refreshToken);
      
      // Role-based redirect
      switch(data.user.role) {
        case ROLE.ADMIN:
          router.push(ROUTES.ADMIN.DASHBOARD);
          break;
        case ROLE.TEACHER:
          router.push(ROUTES.TEACHER.DASHBOARD);
          break;
        case ROLE.STUDENT:
          router.push(ROUTES.STUDENT.DASHBOARD);
          break;
        default:
          router.push('/');
      }
    },
  });
}

export function useRegisterStudent() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterStudentRequest) => authApi.registerStudent(data),
    onSuccess: () => {
      // Redirect to login after successful registration
      router.push(ROUTES.PUBLIC.LOGIN);
    },
  });
}
