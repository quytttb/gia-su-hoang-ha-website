import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import { format } from 'date-fns';
import { Schedule } from '../../types';
import { formatDate } from '../../utils/helpers';
import { CalendarValue } from './scheduleTypes';

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
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      return availableDates.includes(formattedDate) ? 'bg-blue-100 text-blue-800' : null;
    }
    return null;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tileSchedules.filter(schedule => schedule.startDate === dateStr);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const events = getEventsForDate(date);
      if (events.length > 0) {
        return (
          <div className="text-xs mt-1">
            <div className="bg-primary text-white rounded px-1 py-0.5 text-center">
              {events.length} lịch
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 dark:text-gray-400">Chọn ngày trên lịch để xem chi tiết:</p>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onMonthChange('prev')}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              aria-label="Tháng trước"
            >
              ←
            </button>
            <span className="font-medium text-gray-800 dark:text-gray-200 px-2">
              {format(currentMonth, 'MM/yyyy')}
            </span>
            <button
              type="button"
              onClick={() => onMonthChange('next')}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              aria-label="Tháng sau"
            >
              →
            </button>
          </div>
        </div>
        <div className="mb-4">
          <button
            type="button"
            onClick={onToggleCalendarEvents}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              showCalendarEvents
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {showCalendarEvents ? 'Ẩn số lượng lịch' : 'Hiện số lượng lịch'}
          </button>
        </div>
        <div className="calendar-container">
          <Calendar
            onChange={value => onCalendarChange(value as CalendarValue)}
            value={calendarValue}
            tileClassName={tileClassName}
            tileContent={showCalendarEvents ? tileContent : undefined}
            activeStartDate={currentMonth}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate) onActiveStartDateChange(activeStartDate);
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
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {schedule.className}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {schedule.startTime} - {schedule.endTime} | {schedule.tutorName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 italic">
                {hasActiveFilters
                  ? 'Không tìm thấy lịch học phù hợp với bộ lọc.'
                  : 'Không có lịch học nào vào ngày đã chọn.'}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="mt-2 text-primary hover:text-blue-700 underline"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendarView;
