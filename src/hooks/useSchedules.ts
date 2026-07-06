import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getAllSchedules,
  getAvailableScheduleDates,
  getSchedulesByDate,
  getSchedulesByPhone,
} from '@/data/schedules';
import { queryKeys } from '@/lib/queryKeys';

export const useSchedules = () =>
  useQuery({
    queryKey: queryKeys.schedules.all,
    queryFn: () => getAllSchedules(),
    refetchInterval: 30_000,
  });

export const useAvailableScheduleDates = () =>
  useQuery({
    queryKey: queryKeys.schedules.dates,
    queryFn: () => getAvailableScheduleDates(),
    refetchInterval: 30_000,
  });

export const useSchedulesByDate = (date: string) =>
  useQuery({
    queryKey: queryKeys.schedules.byDate(date),
    queryFn: () => getSchedulesByDate(date),
    enabled: !!date,
    refetchInterval: 30_000,
  });

export const usePersonalSchedules = () =>
  useMutation({
    mutationFn: (phone: string) => getSchedulesByPhone(phone),
  });

export const useClassSchedules = (classId: string) =>
  useQuery({
    queryKey: queryKeys.schedules.byClass(classId),
    queryFn: async () => {
      const { getSchedulesByClassId } = await import('@/data/schedules');
      return getSchedulesByClassId(classId);
    },
    enabled: !!classId,
  });
