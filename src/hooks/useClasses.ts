import { useQuery } from '@tanstack/react-query';
import classesService, { ClassFilters } from '@/services/firestore/classesService';
import { convertFirestoreClass } from '@/utils/classHelpers';
import { queryKeys } from '@/lib/queryKeys';

export const useClasses = (filters?: ClassFilters) =>
  useQuery({
    queryKey: queryKeys.classes.list(filters),
    queryFn: async () => {
      const result = await classesService.getClasses(filters);
      return result.data;
    },
  });

export const useActiveClasses = () =>
  useQuery({
    queryKey: queryKeys.classes.active,
    queryFn: async () => {
      const result = await classesService.getClasses({ isActive: true });
      return result.data;
    },
    refetchInterval: 30_000,
  });

export const useAdminClasses = () =>
  useQuery({
    queryKey: queryKeys.classes.admin,
    queryFn: async () => {
      const result = await classesService.getAll();
      return result.data;
    },
  });

export const useClass = (id: string) =>
  useQuery({
    queryKey: queryKeys.classes.detail(id),
    queryFn: async () => {
      const result = await classesService.getById(id);
      if (!result.data) return null;
      return convertFirestoreClass(result.data);
    },
    enabled: !!id,
  });
