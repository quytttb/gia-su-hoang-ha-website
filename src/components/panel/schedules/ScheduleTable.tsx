import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/shared/StatusBadge';
import { scheduleStatusConfig } from '@/lib/ui/status-badges';
import { Edit2, Trash2, Users, Calendar, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    const config = scheduleStatusConfig[status === 'active' ? 'active' : 'inactive'];
    return <StatusBadge label={config.label} variant={config.variant} />;
  };

  const getStudentCountBadge = (current: number, max: number) => {
    const percentage = max > 0 ? (current / max) * 100 : 0;
    let variant: 'success' | 'warning' | 'destructive' = 'success';

    if (percentage >= 80) {
      variant = 'destructive';
    } else if (percentage >= 60) {
      variant = 'warning';
    }

    return (
      <Badge variant={variant}>
        <Users className="w-3 h-3 mr-1" />
        {current}/{max}
      </Badge>
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lớp học</TableHead>
          <TableHead>Thời gian</TableHead>
          <TableHead>Giáo viên</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Học viên</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map(schedule => (
          <TableRow key={schedule.id} className="hover:bg-muted/20">
            <TableCell>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{schedule.name}</p>
                  <p className="text-xs text-muted-foreground">{schedule.classroom}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{schedule.time}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{schedule.teacher}</span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(schedule.status)}</TableCell>
            <TableCell>
              {getStudentCountBadge(
                (schedule.studentPhones || []).length,
                schedule.maxStudents || 0
              )}
            </TableCell>
            <TableCell>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ScheduleTable;
