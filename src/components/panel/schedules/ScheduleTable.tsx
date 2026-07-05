import React from 'react';
import { Button } from '../../ui/button';
import { Edit2, Trash2, Users, Calendar, Clock } from 'lucide-react';

export interface Schedule {
  id: string;
  name: string;
  time: string;
  teacher: string;
  classroom: string;
  status?: 'active' | 'inactive';
  maxStudents?: number;
  studentPhones?: string[];
}

interface ScheduleTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onEdit, onDelete }) => {
  const getStatusBadge = (status?: 'active' | 'inactive') => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
          Hoạt động
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
        Đã qua
      </span>
    );
  };

  const getStudentCountBadge = (current: number, max: number) => {
    const percentage = max > 0 ? (current / max) * 100 : 0;
    let colorClass = 'bg-green-100 text-green-800';

    if (percentage >= 80) {
      colorClass = 'bg-red-100 text-red-800';
    } else if (percentage >= 60) {
      colorClass = 'bg-yellow-100 text-yellow-800';
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        <Users className="w-3 h-3 mr-1" />
        {current}/{max}
      </span>
    );
  };

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">Không có lịch học</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Chưa có lịch học nào được tạo. Hãy tạo lịch học đầu tiên.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
              Lớp học
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
              Thời gian
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
              Giáo viên
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
              Học viên
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(schedule => (
            <tr
              key={schedule.id}
              className="hover:bg-muted/20 transition-colors border-b border-border"
            >
              <td className="px-6 py-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{schedule.name}</p>
                    <p className="text-xs text-muted-foreground">{schedule.classroom}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{schedule.time}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{schedule.teacher}</span>
                </div>
              </td>
              <td className="px-6 py-4">{getStatusBadge(schedule.status)}</td>
              <td className="px-6 py-4">
                {getStudentCountBadge(
                  (schedule.studentPhones || []).length,
                  schedule.maxStudents || 0
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(schedule)}
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(schedule)}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
