import { useMutation, useQuery } from '@tanstack/react-query';
import schedulesService from '@/services/firestore/schedulesService';
import { queryKeys } from '@/lib/queryKeys';

export const useSchedules = () =>
  useQuery({
    queryKey: queryKeys.schedules.all,
    queryFn: () => schedulesService.getAll(),
  });

export const useAvailableScheduleDates = () =>
  useQuery({
    queryKey: queryKeys.schedules.dates,
    queryFn: () => schedulesService.getAvailableDates(),
  });

export const useSchedulesByDate = (date: string) =>
  useQuery({
    queryKey: queryKeys.schedules.byDate(date),
    queryFn: () => schedulesService.getByDate(date),
    enabled: !!date,
  });

export const useClassSchedules = (classId: string) =>
  useQuery({
    queryKey: queryKeys.schedules.byClass(classId),
    queryFn: () => schedulesService.getByClassId(classId),
    enabled: !!classId,
  });

export const usePersonalSchedules = () =>
  useMutation({
    mutationFn: (phone: string) => schedulesService.getByUserPhone(phone),
  });
