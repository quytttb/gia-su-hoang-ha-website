import { useQuery } from '@tanstack/react-query';
import tutorsService from '@/services/firestore/tutorsService';
import { queryKeys } from '@/lib/queryKeys';

export const useTutors = (activeOnly = true) =>
  useQuery({
    queryKey: queryKeys.tutors.list(activeOnly),
    queryFn: () => (activeOnly ? tutorsService.getActiveTutors() : tutorsService.getAllTutors()),
  });
