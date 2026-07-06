import { DayPicker } from 'react-day-picker';
import { vi } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { Schedule } from '../../types';
import { formatDate } from '../../utils/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarValue } from './scheduleTypes';
import 'react-day-picker/style.css';

interface ScheduleCalendarViewProps {
  calendarValue: CalendarValue;
  currentMonth: Date;
  selectedDate: string;
  availableDates: string[];
  displaySchedules: Schedule[];
  tileSchedules: Schedule[];
  showCalendarEvents: boolean;
  hasActiveFilters: boolean;
  onCalendarChange: (value: CalendarValue) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onActiveStartDateChange: (date: Date) => void;
  onToggleCalendarEvents: () => void;
  onClearFilters: () => void;
}

const ScheduleCalendarView = ({
  calendarValue,
  currentMonth,
  selectedDate,
  availableDates,
  displaySchedules,
  tileSchedules,
  showCalendarEvents,
  hasActiveFilters,
  onCalendarChange,
  onMonthChange,
  onActiveStartDateChange,
  onToggleCalendarEvents,
  onClearFilters,
}: ScheduleCalendarViewProps) => {
  const scheduleDates = availableDates.map(date => parseISO(date));

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tileSchedules.filter(schedule => schedule.startDate === dateStr);
  };

  const selected = calendarValue instanceof Date ? calendarValue : undefined;

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground">Chọn ngày trên lịch để xem chi tiết:</p>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => onMonthChange('prev')}
                aria-label="Tháng trước"
              >
                ←
              </Button>
              <span className="font-medium text-foreground px-2">
                {format(currentMonth, 'MM/yyyy')}
              </span>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => onMonthChange('next')}
                aria-label="Tháng sau"
              >
                →
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <Button
              type="button"
              variant={showCalendarEvents ? 'default' : 'secondary'}
              size="sm"
              onClick={onToggleCalendarEvents}
            >
              {showCalendarEvents ? 'Ẩn số lượng lịch' : 'Hiện số lượng lịch'}
            </Button>
          </div>
          <div className="calendar-container flex justify-center">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={date => onCalendarChange(date ?? null)}
              month={currentMonth}
              onMonthChange={onActiveStartDateChange}
              locale={vi}
              modifiers={{ hasSchedule: scheduleDates }}
              modifiersClassNames={{
                hasSchedule: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
              }}
              components={{
                DayButton: props => {
                  const { day, modifiers, ...buttonProps } = props;
                  void modifiers;
                  const events = getEventsForDate(day.date);
                  return (
                    <button {...buttonProps} type="button">
                      <span>{day.date.getDate()}</span>
                      {showCalendarEvents && events.length > 0 && (
                        <span className="block text-xs mt-0.5">
                          <span className="bg-primary text-white rounded px-1 py-0.5 text-center text-[10px] leading-tight">
                            {events.length} lịch
                          </span>
                        </span>
                      )}
                    </button>
                  );
                },
              }}
            />
          </div>
        </div>

        {selectedDate && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">Lịch học ngày {formatDate(selectedDate)}</h3>

            {displaySchedules.length > 0 ? (
              <div className="space-y-4">
                {displaySchedules.map(schedule => (
                  <div key={schedule.id} className="border-l-4 border-primary pl-4 py-2">
                    <p className="font-medium text-foreground">{schedule.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {schedule.startTime} - {schedule.endTime} | {schedule.tutorName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground italic">
                  {hasActiveFilters
                    ? 'Không tìm thấy lịch học phù hợp với bộ lọc.'
                    : 'Không có lịch học nào vào ngày đã chọn.'}
                </p>
                {hasActiveFilters && (
                  <Button type="button" variant="link" onClick={onClearFilters} className="mt-2">
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendarView;
