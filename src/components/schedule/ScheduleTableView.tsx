import { Schedule } from '../../types';
import { formatDate } from '../../utils/helpers';

interface ScheduleTableViewProps {
  availableDates: string[];
  selectedDate: string;
  schedules: Schedule[];
  hasActiveFilters: boolean;
  onDateChange: (date: string) => void;
  onClearFilters: () => void;
}

const ScheduleTableView = ({
  availableDates,
  selectedDate,
  schedules,
  hasActiveFilters,
  onDateChange,
  onClearFilters,
}: ScheduleTableViewProps) => (
  <>
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 mb-6">
        {availableDates.map(date => (
          <button
            key={date}
            type="button"
            onClick={() => onDateChange(date)}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedDate === date
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {formatDate(date)}
          </button>
        ))}
      </div>
    </div>

    {schedules.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">Lớp học</th>
              <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">Thời gian</th>
              <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">Giáo viên</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr
                key={schedule.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                  {schedule.className}
                </td>
                <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                  {schedule.startTime} - {schedule.endTime}
                </td>
                <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{schedule.tutorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {hasActiveFilters
            ? 'Không tìm thấy lịch học phù hợp với bộ lọc.'
            : 'Không có lịch học nào vào ngày đã chọn.'}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    )}
  </>
);

export default ScheduleTableView;
