import { useQuery } from '@tanstack/react-query';
import {
  getClasses,
  getActiveClasses,
  getClassById,
  getAllClasses,
  type ClassFilters,
} from '@/data/classes';
import { queryKeys } from '@/lib/queryKeys';

export type { ClassFilters };

export const useClasses = (filters?: ClassFilters) =>
  useQuery({
    queryKey: queryKeys.classes.list(filters),
    queryFn: () => getClasses(filters),
  });

export const useActiveClasses = () =>
  useQuery({
    queryKey: queryKeys.classes.active,
    queryFn: () => getActiveClasses(),
    refetchInterval: 30_000,
  });

export const useAdminClasses = () =>
  useQuery({
    queryKey: queryKeys.classes.admin,
    queryFn: () => getAllClasses(),
  });

export const useClass = (id: string) =>
  useQuery({
    queryKey: queryKeys.classes.detail(id),
    queryFn: () => getClassById(id),
    enabled: !!id,
  });
