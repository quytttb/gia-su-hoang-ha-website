import { CenterInfo } from '../../types';
import Link from 'next/link';
import SkeletonLoading from '../shared/SkeletonLoading';
import { ArrowRight } from 'lucide-react';

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
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Tìm hiểu thêm về trung tâm"
            >
              Tìm hiểu thêm về chúng tôi
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </footer>
      </div>
    </section>
  );
};

export default IntroductionSection;
