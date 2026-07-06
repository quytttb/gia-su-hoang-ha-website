import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import SectionHeading from '../shared/SectionHeading';

interface Feedback {
  id: string;
  parentName: string;
  studentName: string;
  rating: number;
  comment: string;
  subject: string;
  avatar?: string;
  date: string;
}

interface ParentFeedbackSectionProps {
  feedbacks?: Feedback[];
  loading?: boolean;
}

const defaultFeedbacks: Feedback[] = [
  {
    id: '1',
    parentName: 'Chị Nguyễn Thị Lan',
    studentName: 'Nguyễn Minh An',
    rating: 5,
    comment:
      'Con tôi học lớp Tiền tiểu học ở trung tâm, tiến bộ rõ rệt về nhận biết chữ số, làm quen với môi trường học tập mới. Giáo viên rất tận tâm và thân thiện.',
    subject: 'Tiền tiểu học',
    date: '2024-12-15',
  },
  {
    id: '2',
    parentName: 'Anh Trần Văn Hùng',
    studentName: 'Trần Thảo My',
    rating: 5,
    comment:
      'Bé học Toán 9 tại trung tâm, kết quả thi học kỳ vừa rồi tăng lên rõ rệt. Giáo viên giảng bài dễ hiểu, sát chương trình.',
    subject: 'Toán lớp 9',
    date: '2024-12-10',
  },
  {
    id: '3',
    parentName: 'Chị Lê Thị Hương',
    studentName: 'Lê Quang Minh',
    rating: 5,
    comment:
      'Con tôi học Toán 8, không chỉ tiến bộ môn Toán mà còn yêu thích môn Văn hơn. Giáo viên luôn động viên và hỗ trợ kịp thời.',
    subject: 'Toán lớp 8',
    date: '2024-12-08',
  },
  {
    id: '4',
    parentName: 'Anh Phạm Đức Nam',
    studentName: 'Phạm Hoàng Anh',
    rating: 5,
    comment:
      'Môn Tiếng Anh của con được cải thiện đáng kể. Từ vựng phong phú hơn, phát âm chuẩn hơn. Rất hài lòng với chất lượng giảng dạy.',
    subject: 'Tiếng Anh lớp 7',
    date: '2024-12-05',
  },
];

const ParentFeedbackSection: React.FC<ParentFeedbackSectionProps> = ({
  feedbacks = defaultFeedbacks,
  loading = false,
}) => {
  const displayFeedbacks = feedbacks.slice(0, 4);

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-br from-background to-accent/10">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="parent-feedback"
      className="section-padding bg-gradient-to-br from-background to-accent/10"
      aria-labelledby="feedback-heading"
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <SectionHeading
            title="Chia sẻ của Phụ huynh"
            description="Những chia sẻ chân thành từ phụ huynh về chất lượng dạy học của chúng tôi"
            id="feedback-heading"
            variant="centered"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {displayFeedbacks.map(feedback => (
            <Card key={feedback.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-primary opacity-60" />
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < feedback.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  &ldquo;{feedback.comment}&rdquo;
                </blockquote>

                <footer className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {feedback.parentName.split(' ').pop()?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{feedback.parentName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Phụ huynh của {feedback.studentName}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{feedback.subject}</Badge>
                </footer>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParentFeedbackSection;
