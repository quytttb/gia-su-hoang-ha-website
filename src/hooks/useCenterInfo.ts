import { useQuery } from '@tanstack/react-query';
import { getCenterInfo, getGalleryImages, getSiteAsset } from '@/data/settings';
import { queryKeys } from '@/lib/queryKeys';

export const useCenterInfo = () =>
  useQuery({
    queryKey: queryKeys.settings.centerInfo,
    queryFn: () => getCenterInfo(),
  });

export const useGalleryImages = () =>
  useQuery({
    queryKey: queryKeys.settings.gallery,
    queryFn: () => getGalleryImages(),
  });

export const useSiteAsset = (key: string) =>
  useQuery({
    queryKey: queryKeys.settings.siteAsset(key),
    queryFn: () => getSiteAsset(key),
    enabled: !!key,
  });
