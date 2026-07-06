import { useMemo } from 'react';
import { Tutor } from '../../types';
import SectionHeading from '../shared/SectionHeading';
import LazyImage from '../shared/LazyImage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <section id="team" className="section-padding bg-muted" aria-labelledby="team-heading">
      <div className="container-custom">
        <SectionHeading title="Đội ngũ giáo viên" id="team-heading" />
        {sortedTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedTutors.map(tutor => (
              <Card
                key={tutor.id}
                className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="h-80 overflow-hidden">
                  <LazyImage
                    src={tutor.imageUrl}
                    alt={tutor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-foreground mb-1">{tutor.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {tutor.specialty}
                  </Badge>
                  <p className="text-muted-foreground text-sm">{tutor.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-lg">
              Thông tin giáo viên sẽ được cập nhật sớm.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutTeamSection;
