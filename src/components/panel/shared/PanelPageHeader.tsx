import { Card, CardContent } from '@/components/ui/card';

interface PanelPageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const PanelPageHeader = ({ title, description, action }: PanelPageHeaderProps) => (
  <Card>
    <CardContent className={`p-6 ${action ? 'flex items-center justify-between' : ''}`}>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action}
    </CardContent>
  </Card>
);

export default PanelPageHeader;
