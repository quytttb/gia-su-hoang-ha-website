import { useQuery } from '@tanstack/react-query';
import settingsService from '@/services/firestore/settingsService';
import { queryKeys } from '@/lib/queryKeys';

export const useCenterInfo = () =>
  useQuery({
    queryKey: queryKeys.centerInfo,
    queryFn: () => settingsService.getCenterInfo(),
  });
