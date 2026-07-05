import React from 'react';
import { Award, Users, BookOpen, TrendingUp, Target, Star } from 'lucide-react';

interface Achievement {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
}

interface AchievementsSectionProps {
  achievements?: Achievement[];
  loading?: boolean;
}

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    icon: Users,
    title: 'Học viên đã học',
    value: '1000+',
    description: 'Học viên tin tâm chọn lựa',
  },
  {
    id: '2',
    icon: BookOpen,
    title: 'Khóa học',
    value: '20+',
    description: 'Đa dạng các môn học',
  },
  {
    id: '3',
    icon: Award,
    title: 'Năm kinh nghiệm',
    value: '5+',
    description: 'Phục vụ giáo dục chất lượng',
  },
  {
    id: '4',
    icon: TrendingUp,
    title: 'Tỷ lệ thành công',
    value: '95%',
    description: 'Học viên đạt kết quả tốt',
  },
  {
    id: '5',
    icon: Target,
    title: 'Mục tiêu hoàn thành',
    value: '98%',
    description: 'Học viên đạt mục tiêu đề ra',
  },
  {
    id: '6',
    icon: Star,
    title: 'Đánh giá trung bình',
    value: '4.8/5',
    description: 'Từ phụ huynh và học viên',
  },
];

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements = defaultAchievements,
  loading = false,
}) => {
  if (loading) {
    return (
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="achievements"
      className="section-padding bg-gray-50 dark:bg-gray-900"
      aria-labelledby="achievements-heading"
    >
      <div className="container-custom">
        {/* Section Header */}
        <header className="text-center mb-12">
          <h2
            id="achievements-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Thành tựu nổi bật
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Những con số ấn tượng thể hiện chất lượng và hiệu quả của chúng tôi
          </p>
        </header>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {achievements.map(achievement => {
            const IconComponent = achievement.icon;
            return (
              <div key={achievement.id} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {achievement.value}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
