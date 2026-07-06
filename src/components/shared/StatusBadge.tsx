import { Badge, type BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  label: string;
  variant: NonNullable<BadgeProps['variant']>;
}

const StatusBadge = ({ label, variant, className, ...props }: StatusBadgeProps) => (
  <Badge variant={variant} className={cn(className)} {...props}>
    {label}
  </Badge>
);

export default StatusBadge;
