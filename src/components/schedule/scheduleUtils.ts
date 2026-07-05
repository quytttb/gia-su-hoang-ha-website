import { Schedule } from '../../types';

export function filterSchedules(
  schedules: Schedule[],
  searchKeyword: string,
  filterTutor: string
): Schedule[] {
  let filtered = [...schedules];

  if (searchKeyword) {
    const keyword = searchKeyword.toLowerCase();
    filtered = filtered.filter(
      schedule =>
        schedule.className.toLowerCase().includes(keyword) ||
        schedule.tutorName.toLowerCase().includes(keyword)
    );
  }

  if (filterTutor !== 'all') {
    filtered = filtered.filter(schedule => schedule.tutorName === filterTutor);
  }

  return filtered;
}
