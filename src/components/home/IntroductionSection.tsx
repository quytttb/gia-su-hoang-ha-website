import { CenterInfo } from '../../types';
import Link from 'next/link';
import SkeletonLoading from '../shared/SkeletonLoading';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '../shared/SectionHeading';

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
        <div className="text-center mb-12">
          <SectionHeading
            title="Về Trung tâm Gia Sư Hoàng Hà"
            id="introduction-heading"
            variant="centered"
          />
          {loading ? (
            <SkeletonLoading type="text" count={2} className="mx-auto max-w-3xl mt-4" />
          ) : (
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4">
              {centerInfo.description}
            </p>
          )}
        </div>

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
