import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, type UpdateStudentProfilePayload } from '@/lib/api/userApi';
import { useAuthStore } from '@/store/authStore';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => userApi.getMe(),
  });
}

export function useStudentProfile() {
  return useQuery({
    queryKey: ['students', 'me', 'profile'],
    queryFn: () => userApi.getStudentProfile(),
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();
  const { setCredentials, user, accessToken } = useAuthStore.getState();

  return useMutation({
    mutationFn: (data: UpdateStudentProfilePayload) => userApi.updateStudentProfile(data),
    onSuccess: (data) => {
      // Refresh local cache
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      
      // Update store if necessary (assuming data contains updated user)
      if (user && accessToken) {
         setCredentials({ ...user, ...data }, accessToken, useAuthStore.getState().refreshToken);
      }
    },
  });
}
