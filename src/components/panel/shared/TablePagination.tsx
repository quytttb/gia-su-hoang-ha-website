import { Button } from '@/components/ui/button';

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const TablePagination = ({
  page,
  totalPages,
  onPageChange,
  className = 'flex justify-end items-center gap-2 mt-4',
}: TablePaginationProps) => (
  <div className={className}>
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
);

export default TablePagination;
