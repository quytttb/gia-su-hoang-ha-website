'use client';

import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Chatbot from '@/components/shared/Chatbot';
import PageHero from '@/components/shared/PageHero';
import { Button } from '@/components/ui/button';
import { useSiteAsset } from '@/hooks/useCenterInfo';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const TutorSearchScreen = () => {
  const router = useRouter();
  const { data: teacherAsset } = useSiteAsset('tutor_search_teacher');
  const { data: studentAsset } = useSiteAsset('tutor_search_student');

  const handleSelectTutorType = (type: 'teacher' | 'student') => {
    router.push(`/tutor-search/register?type=${type}`);
  };

  return (
    <Layout>
      <PageHero
        id="tutor-search-hero-heading"
        title="Tìm Gia sư phù hợp"
        description="Bạn muốn tìm Gia sư nào? Hãy chọn bên dưới nhé!"
      />
      <div className="container-custom py-8 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gia sư giáo viên */}
            <Card className="hover:shadow-xl transition-all duration-300 flex flex-col">
              <CardHeader className="text-center pb-0">
                <div className="w-full flex justify-center mb-4">
                  <img
                    src={teacherAsset?.url || '/images/gia-su-giao-vien.jpg'}
                    alt="Gia sư Giáo viên"
                    className="rounded-lg object-cover max-h-40 w-auto shadow aspect-[1.475] bg-muted"
                  />
                </div>
                <CardTitle className="text-2xl mb-2">Gia sư Giáo viên</CardTitle>
                <div className="text-3xl font-bold text-primary mb-4">
                  250,000đ
                  <span className="text-lg font-normal text-muted-foreground">/buổi</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-4">
                  {[
                    'Giáo viên nhiều năm kinh nghiệm',
                    'Chuyên môn vững vàng',
                    'Phương pháp đa dạng và chuyên sâu',
                    'Phù hợp với Học sinh mất gốc hoặc chinh phục 9+',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button onClick={() => handleSelectTutorType('teacher')} className="w-full">
                  Chọn Gia sư Giáo viên
                </Button>
              </CardFooter>
            </Card>

            {/* Gia sư sinh viên */}
            <Card className="hover:shadow-xl transition-all duration-300 flex flex-col">
              <CardHeader className="text-center pb-0">
                <div className="w-full flex justify-center mb-4">
                  <img
                    src={studentAsset?.url || '/images/gia-su-sinh-vien.jpg'}
                    alt="Gia sư Sinh viên"
                    className="rounded-lg object-cover max-h-40 w-auto shadow aspect-[1.475] bg-muted"
                  />
                </div>
                <CardTitle className="text-2xl mb-2">Gia sư Sinh viên</CardTitle>
                <div className="text-3xl font-bold text-primary mb-4">
                  160,000đ
                  <span className="text-lg font-normal text-muted-foreground">/buổi</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-4">
                  {[
                    'Sinh viên giỏi của Trường Đại học Hồng Đức',
                    'Trẻ, gần gũi, dễ dàng thấu hiểu tâm lý Học sinh',
                    'Học phí rẻ hợp lý',
                    'Lịch học linh hoạt, chủ động',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button onClick={() => handleSelectTutorType('student')} className="w-full">
                  Chọn Gia sư Sinh viên
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Thông tin thêm */}
          <div className="mt-12 bg-muted rounded-xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Quy trình tìm Gia sư
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Đăng ký', desc: 'Điền thông tin và yêu cầu' },
                { step: '2', title: 'Tư vấn', desc: 'Nhân viên tư vấn chi tiết' },
                { step: '3', title: 'Chọn lọc', desc: 'Tìm Gia sư phù hợp nhất' },
                { step: '4', title: 'Học thử', desc: 'Dạy thử miễn phí 1 buổi' },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </Layout>
  );
};

export default TutorSearchScreen;
