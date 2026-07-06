import { Class } from '../../types';
import SkeletonLoading from '../shared/SkeletonLoading';
import ClassCard from '../shared/ClassCard';

interface FeaturedClassesSectionProps {
  featuredClasses: Class[];
  loading?: boolean;
}

const FeaturedClassesSection = ({ featuredClasses, loading }: FeaturedClassesSectionProps) => {
  return (
    <section
      id="featured-classes"
      className="section-padding bg-background"
      aria-labelledby="featured-classes-heading"
    >
      <div className="container-custom">
        {/* Section Header */}
        <header className="text-center mb-12">
          <h2
            id="featured-classes-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Lớp học nổi bật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những lớp học được yêu thích và đánh giá cao nhất
          </p>
        </header>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            <SkeletonLoading type="card" count={6} />
          ) : featuredClasses.length > 0 ? (
            featuredClasses.map(classItem => <ClassCard key={classItem.id} class={classItem} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-xl font-medium text-muted-foreground mb-2">Chưa có lớp học nào</p>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Các lớp học sẽ được cập nhật sớm
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedClassesSection;
