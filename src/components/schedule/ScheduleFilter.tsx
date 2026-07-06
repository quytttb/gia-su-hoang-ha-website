import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  <div className="bg-muted p-4 rounded-lg mb-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label>Tìm kiếm</Label>
        <Input
          type="text"
          placeholder="Tìm lớp, giáo viên, phòng..."
          value={searchKeyword}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Giáo viên</Label>
        <Select value={filterTutor} onValueChange={onTutorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tất cả giáo viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả giáo viên</SelectItem>
            {availableTutors.map(tutor => (
              <SelectItem key={tutor} value={tutor}>
                {tutor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <Button type="button" variant="secondary" onClick={onClearFilters}>
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  </div>
);

export default ScheduleFilter;
