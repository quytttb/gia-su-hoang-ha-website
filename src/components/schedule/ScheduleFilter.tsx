interface ScheduleFilterProps {
  searchKeyword: string;
  filterTutor: string;
  availableTutors: string[];
  onSearchChange: (value: string) => void;
  onTutorChange: (value: string) => void;
  onClearFilters: () => void;
}

const ScheduleFilter = ({
  searchKeyword,
  filterTutor,
  availableTutors,
  onSearchChange,
  onTutorChange,
  onClearFilters,
}: ScheduleFilterProps) => (
  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Tìm kiếm
        </label>
        <input
          type="text"
          placeholder="Tìm lớp, giáo viên, phòng..."
          value={searchKeyword}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Giáo viên
        </label>
        <select
          value={filterTutor}
          onChange={e => onTutorChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Tất cả giáo viên</option>
          {availableTutors.map(tutor => (
            <option key={tutor} value={tutor}>
              {tutor}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="button"
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  </div>
);

export default ScheduleFilter;
