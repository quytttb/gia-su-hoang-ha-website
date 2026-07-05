import SkeletonLoading from '@/components/shared/SkeletonLoading';
import { Card, CardContent } from '@/components/ui/card';

interface PanelTableSkeletonProps {
  count?: number;
}

const PanelTableSkeleton = ({ count = 10 }: PanelTableSkeletonProps) => (
  <Card>
    <CardContent className="p-6">
      <SkeletonLoading type="table-row" count={count} />
    </CardContent>
  </Card>
);

export default PanelTableSkeleton;
