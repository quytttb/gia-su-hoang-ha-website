import { useQuery } from '@tanstack/react-query';
import { bannerService } from '@/services/bannerService';
import { queryKeys } from '@/lib/queryKeys';

export const useActiveBanners = () =>
  useQuery({
    queryKey: queryKeys.banners.active,
    queryFn: () => bannerService.getActiveBanners(),
  });
