import React from 'react';
import { Star, Quote } from 'lucide-react';

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
      <section className="section-padding bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted dark:bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted dark:bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-background p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-muted dark:bg-muted rounded-full animate-pulse"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-muted dark:bg-muted rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-muted dark:bg-muted rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-20 bg-muted dark:bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="parent-feedback"
      className="section-padding bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/10"
      aria-labelledby="feedback-heading"
    >
      <div className="container-custom">
        {/* Section Header */}
        <header className="text-center mb-12">
          <h2 id="feedback-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Chia sẻ của Phụ huynh
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những chia sẻ chân thành từ phụ huynh về chất lượng dạy học của chúng tôi
          </p>
        </header>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {displayFeedbacks.map(feedback => (
            <article
              key={feedback.id}
              className="bg-background p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="w-8 h-8 text-primary opacity-60" />
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < feedback.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted-foreground dark:text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Feedback Content */}
              <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                "{feedback.comment}"
              </blockquote>

              {/* Author Info */}
              <footer className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {feedback.parentName.split(' ').pop()?.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-foreground">{feedback.parentName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Phụ huynh của {feedback.studentName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {feedback.subject}
                  </span>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParentFeedbackSection;
