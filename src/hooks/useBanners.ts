import { useQuery } from '@tanstack/react-query';
import { getAllBanners, getActiveBanners } from '@/data/banners';
import { queryKeys } from '@/lib/queryKeys';

export const useBanners = () =>
  useQuery({
    queryKey: queryKeys.banners.all,
    queryFn: () => getAllBanners(),
  });

export const useActiveBanners = () =>
  useQuery({
    queryKey: queryKeys.banners.active,
    queryFn: () => getActiveBanners(),
    refetchInterval: 30_000,
  });
