import { useMemo } from 'react';
import { Tutor } from '../../types';
import SectionHeading from '../shared/SectionHeading';
import LazyImage from '../shared/LazyImage';

const TUTOR_ORDER = ['Cô Khương Thị Hà', 'Cô Nguyễn Thị Hoa', 'Cô Bùi Thị Hà', 'Cô Khương Thị Yến'];

interface AboutTeamSectionProps {
  tutors: Tutor[];
}

const AboutTeamSection = ({ tutors }: AboutTeamSectionProps) => {
  const sortedTutors = useMemo(
    () =>
      [...tutors]
        .sort((a, b) => TUTOR_ORDER.indexOf(a.name) - TUTOR_ORDER.indexOf(b.name))
        .slice(0, 4),
    [tutors]
  );

  return (
    <section
      id="team"
      className="section-padding bg-gray-50 dark:bg-gray-900"
      aria-labelledby="team-heading"
    >
      <div className="container-custom">
        <SectionHeading title="Đội ngũ giáo viên" id="team-heading" />
        {sortedTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedTutors.map(tutor => (
              <div
                key={tutor.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="h-80 overflow-hidden">
                  <LazyImage
                    src={tutor.imageUrl}
                    alt={tutor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                    {tutor.name}
                  </h3>
                  <p className="text-primary font-medium mb-3 dark:text-gray-200">
                    {tutor.specialty}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{tutor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Thông tin giáo viên sẽ được cập nhật sớm.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutTeamSection;
