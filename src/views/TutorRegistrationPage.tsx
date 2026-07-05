'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '../components/layout/Layout';
import Chatbot from '../components/shared/Chatbot';
import { defaultRateLimiter, getClientIdentifier } from '../utils/security';
import registrationsService from '../services/firestore/registrationsService';
import confetti from 'canvas-confetti';
import TutorRegistrationForm from '../components/tutor-registration/TutorRegistrationForm';
import TutorInfoSidebar from '../components/tutor-registration/TutorInfoSidebar';
import RegistrationConfirmDialogs from '../components/shared/RegistrationConfirmDialogs';
import { TutorTypeInfo } from '../components/tutor-registration/tutorRegistrationTypes';
import { TutorRegistrationFormValues } from '@/lib/validations/tutor-registration';

const tutorInfo: Record<'teacher' | 'student', TutorTypeInfo> = {
  teacher: {
    name: 'Gia sư Giáo viên',
    price: '250,000đ/buổi',
    description: 'Giáo viên có kinh nghiệm, chuyên môn sâu rộng',
    color: 'blue',
  },
  student: {
    name: 'Gia sư Sinh viên',
    price: '160,000đ/buổi',
    description: 'Sinh viên xuất sắc, gần gũi, dễ tiếp cận',
    color: 'green',
  },
};

const TutorRegistrationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tutorType = (searchParams?.get('type') as 'teacher' | 'student' | null) ?? null;

  const [submitting, setSubmitting] = useState(false);
  const [pendingData, setPendingData] = useState<TutorRegistrationFormValues | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const currentTutorInfo = tutorType ? tutorInfo[tutorType] : null;

  const handleSubmit = (data: TutorRegistrationFormValues) => {
    if (!currentTutorInfo) return;
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!currentTutorInfo || !tutorType || !pendingData) return;

    const clientId = getClientIdentifier();
    if (!defaultRateLimiter.isAllowed(clientId)) {
      const remaining = defaultRateLimiter.getRemainingRequests(clientId);
      alert(`Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau. Còn lại: ${remaining} yêu cầu.`);
      return;
    }

    try {
      setSubmitting(true);
      setShowConfirmDialog(false);

      const registrationData = {
        type: tutorType === 'teacher' ? ('tutor_teacher' as const) : ('tutor_student' as const),
        tutorType,
        tutorCriteria: pendingData.tutorCriteria,
        studentName: pendingData.name,
        studentPhone: pendingData.parentPhone,
        studentSchool: pendingData.school,
        parentName: pendingData.parentName,
        parentPhone: pendingData.parentPhone,
        parentAddress: pendingData.parentAddress,
        preferredSchedule: '',
        notes: pendingData.academicDescription || '',
        registrationDate: new Date().toISOString(),
        status: 'pending' as const,
      };

      const createResult = await registrationsService.createRegistration(registrationData);
      if (createResult.error) {
        alert(`Có lỗi xảy ra khi đăng ký: ${createResult.error}`);
        return;
      }

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error submitting tutor search request:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua Zalo.');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerMoreConfetti = () => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  };

  if (!tutorType || !currentTutorInfo) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Loại Gia sư không hợp lệ
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Vui lòng chọn loại Gia sư từ trang tìm Gia sư.
          </p>
          <Button asChild>
            <Link href="/tutor-search">Quay lại trang tìm Gia sư</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-16 pb-40 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
            Đăng ký tìm Gia sư
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <TutorRegistrationForm submitting={submitting} onSubmit={handleSubmit} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <TutorInfoSidebar tutorInfo={currentTutorInfo} />
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
      <RegistrationConfirmDialogs
        variant="tutor"
        entityName={currentTutorInfo.name}
        showConfirmDialog={showConfirmDialog}
        showSuccessDialog={showSuccessDialog}
        submitting={submitting}
        onConfirmOpenChange={setShowConfirmDialog}
        onSuccessOpenChange={setShowSuccessDialog}
        onConfirmSubmit={handleConfirmSubmit}
        onTriggerConfetti={triggerMoreConfetti}
        onNavigateBack={() => router.push('/tutor-search')}
      />
    </Layout>
  );
};

export default TutorRegistrationPage;
