import { Schedule } from '../../types';
import { formatDate } from '../../utils/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
          <Button
            key={date}
            type="button"
            variant={selectedDate === date ? 'default' : 'secondary'}
            onClick={() => onDateChange(date)}
          >
            {formatDate(date)}
          </Button>
        ))}
      </div>
    </div>

    {schedules.length > 0 ? (
      <Card className="overflow-x-auto shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Lớp học</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Giáo viên</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map(schedule => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.className}</TableCell>
                  <TableCell>
                    {schedule.startTime} - {schedule.endTime}
                  </TableCell>
                  <TableCell>{schedule.tutorName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    ) : (
      <Card className="shadow-md">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? 'Không tìm thấy lịch học phù hợp với bộ lọc.'
              : 'Không có lịch học nào vào ngày đã chọn.'}
          </p>
          {hasActiveFilters && (
            <Button type="button" variant="link" onClick={onClearFilters} className="mt-4">
              Xóa bộ lọc
            </Button>
          )}
        </CardContent>
      </Card>
    )}
  </>
);

export default ScheduleTableView;
