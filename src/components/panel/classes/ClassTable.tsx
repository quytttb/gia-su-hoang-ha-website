import React, { useState } from 'react';
import { Class } from '../../../types';
import { formatCurrency, hasValidDiscount } from '../../../utils/helpers';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TablePagination from '@/components/panel/shared/TablePagination';

interface ClassTableProps {
  classes: Class[];
  page: number;
  pageSize: number;
  total: number;
  onEdit: (classItem: Class) => void;
  onDelete: (classItem: Class) => void;
  onViewRegistrations: (classItem: Class) => void;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: { category?: string; status?: string }) => void;
  onSearch: (keyword: string) => void;
  categories: string[];
}

const ClassTable: React.FC<ClassTableProps> = ({
  classes,
  page,
  pageSize,
  total,
  onEdit,
  onDelete,
  onViewRegistrations,
  onPageChange,
  onFilterChange,
  onSearch,
  categories,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ category: value, status });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ category, status: value });
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-end mb-4">
        <div className="w-full sm:w-auto flex-1 min-w-[180px]">
          <Label htmlFor="search" className="sr-only">
            Tìm kiếm
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Tìm kiếm tên lớp học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className=""
          />
        </div>
        <Button type="submit" className="h-10">
          Tìm kiếm
        </Button>
        <div className="min-w-[160px]">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="text-foreground">
              <SelectValue placeholder="Tất cả thể loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-foreground" value="all">
                Tất cả thể loại
              </SelectItem>
              {categories.map(cat => (
                <SelectItem className="text-foreground" key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[160px]">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="text-foreground">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-foreground" value="all">
                Tất cả trạng thái
              </SelectItem>
              <SelectItem className="text-foreground" value="active">
                Đang mở
              </SelectItem>
              <SelectItem className="text-foreground" value="inactive">
                Đã ẩn
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>

      {/* Table */}
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="font-semibold">Ảnh</TableHead>
              <TableHead className="font-semibold">Tên</TableHead>
              <TableHead className="font-semibold">Giá</TableHead>
              <TableHead className="font-semibold">Thể loại</TableHead>
              <TableHead className="font-semibold">Giảm giá</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
              <TableHead className="font-semibold">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Không có lớp học nào.
                </TableCell>
              </TableRow>
            ) : (
              classes.map(classItem => {
                const hasDiscountValue = hasValidDiscount(
                  classItem.discount,
                  classItem.discountEndDate
                );
                return (
                  <TableRow key={classItem.id} className="hover:bg-accent/40">
                    <TableCell>
                      <img
                        src={classItem.imageUrl}
                        alt={classItem.name}
                        className="h-12 w-12 object-cover rounded-md border"
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-foreground text-base line-clamp-2">
                        {classItem.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      {hasDiscountValue ? (
                        <div className="flex flex-col gap-1">
                          <span className="line-through text-muted-foreground text-xs">
                            {formatCurrency(classItem.price)}
                          </span>
                          <span className="font-bold text-foreground">
                            {formatCurrency(
                              classItem.price - (classItem.price * (classItem.discount || 0)) / 100
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-foreground">
                          {formatCurrency(classItem.price)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-foreground">{classItem.category}</TableCell>
                    <TableCell>
                      {hasDiscountValue ? (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white font-semibold">
                          Giảm {classItem.discount}%<br />
                          đến {classItem.discountEndDate}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {classItem.featured && (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-400 text-black dark:bg-yellow-600 dark:text-black mr-1">
                          Nổi bật
                        </span>
                      )}
                      {classItem.isActive !== false ? (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white dark:bg-green-700 dark:text-white font-semibold">
                          Đang mở
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-gray-700 text-gray-200 dark:bg-gray-600 dark:text-gray-100 font-semibold">
                          Đã ẩn
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-foreground"
                        onClick={() => onEdit(classItem)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => onViewRegistrations(classItem)}
                      >
                        Đăng ký
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(classItem)}>
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};

export default ClassTable;
