import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, type ModerationItem } from '@/lib/api/adminApi';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats(),
  });
}

export function useModerationQueue() {
  return useQuery({
    queryKey: ['admin', 'moderation'],
    queryFn: () => adminApi.getModerationQueue(),
  });
}

export function useApproveContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: ModerationItem['type']; id: string }) =>
      adminApi.approveContent(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.getUsers(params),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, active }: { userId: string; active: boolean }) =>
      adminApi.updateUserStatus(userId, active),
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
