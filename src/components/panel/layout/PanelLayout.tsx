import { cn } from '@/lib/utils';
import PanelSidebar from './PanelSidebar';
import PanelHeader from './PanelHeader';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

interface PanelLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PanelLayout = ({ children, className }: PanelLayoutProps) => (
  <SidebarProvider>
    <PanelSidebar />
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <PanelHeader />
      </header>
      <main className={cn('flex-1 overflow-y-auto p-6', className)}>
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </SidebarInset>
  </SidebarProvider>
);

export default PanelLayout;
