import { CenterInfo } from '../../types';
import Link from 'next/link';
import SkeletonLoading from '../shared/SkeletonLoading';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IntroductionSectionProps {
  centerInfo: CenterInfo;
  loading?: boolean;
}

const IntroductionSection = ({ centerInfo, loading }: IntroductionSectionProps) => {
  return (
    <section
      id="introduction"
      className="section-padding bg-primary/10 dark:bg-muted"
      aria-labelledby="introduction-heading"
    >
      <div className="container-custom">
        {/* Section Header */}
        <header className="text-center mb-12">
          <h2
            id="introduction-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Về Trung tâm Gia Sư Hoàng Hà
          </h2>
          {loading ? (
            <SkeletonLoading type="text" count={2} className="mx-auto max-w-3xl" />
          ) : (
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {centerInfo.description}
            </p>
          )}
        </header>

        {/* Call to Action */}
        <footer className="text-center">
          {loading ? (
            <SkeletonLoading type="button" className="mx-auto" />
          ) : (
            <Button size="lg" className="rounded-xl shadow-lg" asChild>
              <Link href="/about" aria-label="Tìm hiểu thêm về trung tâm">
                Tìm hiểu thêm về chúng tôi
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          )}
        </footer>
      </div>
    </section>
  );
};

export default IntroductionSection;
