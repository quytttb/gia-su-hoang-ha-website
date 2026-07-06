'use client';

import * as React from 'react';
import { format, isValid, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DATE_STORAGE_FORMAT = 'yyyy-MM-dd';

export const parseDateValue = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const parsed = parse(value, DATE_STORAGE_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
};

export const formatDateValue = (date?: Date): string => {
  if (!date || !isValid(date)) return '';
  return format(date, DATE_STORAGE_FORMAT);
};

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  fromDate?: Date;
  toDate?: Date;
}

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  disabled = false,
  className,
  id,
  fromDate,
  toDate,
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const selectedDate = parseDateValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: vi }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={date => {
            onChange(formatDateValue(date));
            setOpen(false);
          }}
          disabled={date => {
            if (fromDate && date < fromDate) return true;
            if (toDate && date > toDate) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
