import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { majorApi } from '@/lib/api/majorApi';

export function useMajors(params?: { group?: string; search?: string }) {
  return useQuery({
    queryKey: ['majors', params],
    queryFn: () => majorApi.getMajors(params),
  });
}

export function useMajorDetail(id: string) {
  return useQuery({
    queryKey: ['majors', id],
    queryFn: () => majorApi.getMajorDetail(id),
    enabled: !!id,
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: () => majorApi.getRecommendations(),
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => majorApi.toggleWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
}
