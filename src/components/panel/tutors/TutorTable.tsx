import React, { useState } from 'react';
import { Tutor } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TablePagination from '@/components/panel/shared/TablePagination';

interface TutorTableProps {
  tutors: Tutor[];
  page: number;
  pageSize: number;
  total: number;
  onEdit: (tutor: Tutor) => void;
  onDelete: (tutor: Tutor) => void;
  onPageChange: (page: number) => void;
  onSearch: (keyword: string) => void;
}

const TutorTable: React.FC<TutorTableProps> = ({
  tutors,
  page,
  pageSize,
  total,
  onEdit,
  onDelete,
  onPageChange,
  onSearch,
}) => {
  const [search, setSearch] = useState('');
  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-end mb-4">
        <div className="w-full sm:w-auto flex-1 min-w-[180px]">
          <Label htmlFor="search" className="sr-only">
            Tìm kiếm
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Tìm kiếm tên giáo viên..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-10">
          Tìm kiếm
        </Button>
      </form>

      {/* Table */}
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="font-semibold">Ảnh</TableHead>
              <TableHead className="font-semibold">Tên</TableHead>
              <TableHead className="font-semibold">Chuyên môn</TableHead>
              <TableHead className="font-semibold">Giới thiệu</TableHead>
              <TableHead className="font-semibold">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tutors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Không có giáo viên nào.
                </TableCell>
              </TableRow>
            ) : (
              tutors.map(tutor => (
                <TableRow key={tutor.id} className="hover:bg-accent/40">
                  <TableCell>
                    <img
                      src={tutor.imageUrl}
                      alt={tutor.name}
                      className="h-12 w-12 object-cover rounded-md border"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-foreground text-base line-clamp-2">
                    {tutor.name}
                  </TableCell>
                  <TableCell className="text-foreground">{tutor.specialty}</TableCell>
                  <TableCell className="text-foreground line-clamp-2 max-w-xs">
                    {tutor.bio}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-foreground"
                      onClick={() => onEdit(tutor)}
                    >
                      Sửa
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(tutor)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};

export default TutorTable;
