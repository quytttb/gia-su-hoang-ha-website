import { useQuery } from '@tanstack/react-query';
import { getAllTutors, getActiveTutors } from '@/data/tutors';
import { queryKeys } from '@/lib/queryKeys';

export const useTutors = () =>
  useQuery({
    queryKey: queryKeys.tutors.all,
    queryFn: () => getAllTutors(),
  });

export const useActiveTutors = () =>
  useQuery({
    queryKey: queryKeys.tutors.active,
    queryFn: () => getActiveTutors(),
    refetchInterval: 30_000,
  });
