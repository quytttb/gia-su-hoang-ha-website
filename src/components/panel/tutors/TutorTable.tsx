import React, { useState } from 'react';
import { Tutor } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

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
      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left font-semibold text-foreground">Ảnh</th>
              <th className="p-3 text-left font-semibold text-foreground">Tên</th>
              <th className="p-3 text-left font-semibold text-foreground">Chuyên môn</th>
              <th className="p-3 text-left font-semibold text-foreground">Giới thiệu</th>
              <th className="p-3 text-left font-semibold text-foreground">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tutors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  Không có giáo viên nào.
                </td>
              </tr>
            ) : (
              tutors.map(tutor => (
                <tr
                  key={tutor.id}
                  className="border-b last:border-0 hover:bg-accent/40 transition-colors"
                >
                  <td className="p-3 align-middle">
                    <img
                      src={tutor.imageUrl}
                      alt={tutor.name}
                      className="h-12 w-12 object-cover rounded-md border"
                    />
                  </td>
                  <td className="p-3 align-middle font-semibold text-foreground text-base line-clamp-2">
                    {tutor.name}
                  </td>
                  <td className="p-3 align-middle text-foreground">{tutor.specialty}</td>
                  <td className="p-3 align-middle text-foreground line-clamp-2 max-w-xs">
                    {tutor.bio}
                  </td>
                  <td className="p-3 align-middle space-x-2">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="text-foreground"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Trước
        </Button>
        <span className="text-sm text-muted-foreground">
          Trang {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="text-foreground"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

export default TutorTable;
