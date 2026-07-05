'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../components/layout/Layout';
import { Class } from '../types';
import classesService from '../services/firestore/classesService';
import registrationsService from '../services/firestore/registrationsService';
import { convertFirestoreClass } from '../utils/classHelpers';
import Chatbot from '../components/shared/Chatbot';
import DevFormHelper from '../components/dev/DevFormHelper';
import { defaultRateLimiter, getClientIdentifier } from '../utils/security';
import { sendRegistrationEmail, sendAutoReplyEmail, initEmailJS } from '../services/emailService';
import confetti from 'canvas-confetti';
import ClassRegistrationForm from '../components/classes/ClassRegistrationForm';
import ClassRegistrationSummary from '../components/classes/ClassRegistrationSummary';
import RegistrationConfirmDialogs from '../components/shared/RegistrationConfirmDialogs';
import { ClassRegistrationFormValues } from '@/lib/validations/class-registration';
import { Button } from '@/components/ui/button';

const ClassRegistrationPage = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [course, setCourse] = useState<Class | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingData, setPendingData] = useState<ClassRegistrationFormValues | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      const result = await classesService.getById(id);
      setCourse(result.data ? convertFirestoreClass(result.data) : undefined);
      setLoading(false);
    };
    fetchCourse();
    initEmailJS();
  }, [id]);

  const handleSubmit = (data: ClassRegistrationFormValues) => {
    if (!id || !course) return;
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!id || !course || !pendingData) {
      alert('Không tìm thấy thông tin lớp học. Vui lòng tải lại trang hoặc chọn lại lớp!');
      return;
    }

    const clientId = getClientIdentifier();
    if (!defaultRateLimiter.isAllowed(clientId)) {
      const remaining = defaultRateLimiter.getRemainingRequests(clientId);
      alert(`Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau. Còn lại: ${remaining} yêu cầu.`);
      return;
    }

    try {
      setSubmitting(true);
      setShowConfirmDialog(false);

      const courseName = course.name || 'Chưa xác định';
      const courseSchedule = course.schedule || 'Linh hoạt';

      const registrationData = {
        type: 'class' as const,
        classId: id,
        className: courseName,
        classSchedule: courseSchedule,
        studentName: pendingData.name,
        studentPhone: pendingData.parentPhone,
        studentSchool: pendingData.school,
        parentName: pendingData.parentName,
        parentPhone: pendingData.parentPhone,
        parentAddress: pendingData.parentAddress,
        preferredSchedule: courseSchedule,
        notes: pendingData.academicDescription || undefined,
        status: 'pending' as const,
      };

      const registrationResult = await registrationsService.createRegistration(registrationData);
      if (registrationResult.error) {
        alert(registrationResult.error);
        return;
      }

      const emailResult = await sendRegistrationEmail(
        pendingData.name,
        '',
        pendingData.parentPhone,
        courseName,
        id,
        courseSchedule
      );

      if (emailResult.success) {
        await sendAutoReplyEmail(pendingData.name, '', true);
      }

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua Zalo.');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerMoreConfetti = () => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Không tìm thấy lớp học
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button asChild>
            <Link href="/classes">Quay lại danh sách lớp học</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-16 pb-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
            Đăng ký lớp học
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:h-[500px]">
            <div className="md:col-span-2 flex flex-col h-full">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col h-full">
                <ClassRegistrationForm submitting={submitting} onSubmit={handleSubmit} />
              </div>
            </div>
            <div className="flex flex-col h-full">
              <ClassRegistrationSummary course={course} />
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
      <RegistrationConfirmDialogs
        variant="class"
        entityName={course.name}
        showConfirmDialog={showConfirmDialog}
        showSuccessDialog={showSuccessDialog}
        submitting={submitting}
        onConfirmOpenChange={setShowConfirmDialog}
        onSuccessOpenChange={setShowSuccessDialog}
        onConfirmSubmit={handleConfirmSubmit}
        onTriggerConfetti={triggerMoreConfetti}
        onNavigateBack={() => router.push('/classes')}
      />
      {process.env.NODE_ENV === 'development' && (
        <DevFormHelper
          onFillForm={(data: ClassRegistrationFormValues) => setPendingData(data)}
          onClearForm={() => setPendingData(null)}
        />
      )}
    </Layout>
  );
};

export default ClassRegistrationPage;
