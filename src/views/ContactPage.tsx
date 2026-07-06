'use client';

import { useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import {
  sendContactEmail,
  sendAutoReplyEmail,
  initEmailJS,
  getEmailServiceStatus,
} from '../services/emailService';
import { saveContactMessage } from '@/actions/contact';
import { defaultRateLimiter, getClientIdentifier } from '../utils/security';
import { toast } from 'sonner';
import Chatbot from '../components/shared/Chatbot';
import ContactInfoSection from '../components/contact/ContactInfoSection';
import ContactFormSection from '../components/contact/ContactFormSection';
import ContactFAQSection from '../components/contact/ContactFAQSection';
import { ContactFormValues } from '@/lib/validations/contact';
import { useState } from 'react';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    initEmailJS();
    const status = getEmailServiceStatus();
    if (!status.isConfigured) {
      console.warn('EmailJS not configured. Missing:', status.missingFields);
    }
  }, []);

  const handleSubmit = useCallback(async (data: ContactFormValues) => {
    const clientId = getClientIdentifier();
    if (!defaultRateLimiter.isAllowed(clientId)) {
      const remaining = defaultRateLimiter.getRemainingRequests(clientId);
      toast.warning('Quá nhiều yêu cầu', {
        description: `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau. Còn lại: ${remaining} yêu cầu.`,
      });
      return;
    }

    try {
      setLoading(true);
      const saveResult = await saveContactMessage(data.name, data.email, data.phone, data.message);
      if (!saveResult.success) {
        console.warn('Failed to save to Firestore:', saveResult.error);
      }

      const emailResult = await sendContactEmail(data.name, data.email, data.phone, data.message);
      if (emailResult.success) {
        await sendAutoReplyEmail(data.name, data.email, false);
        setSuccess(true);
        toast.success('Gửi tin nhắn thành công!', {
          description: 'Chúng tôi đã nhận được tin nhắn và sẽ phản hồi trong thời gian sớm nhất.',
        });
      } else {
        toast.error('Gửi tin nhắn thất bại', { description: emailResult.message });
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      toast.error('Có lỗi xảy ra', {
        description: 'Vui lòng thử lại sau hoặc liên hệ trực tiếp qua số điện thoại.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Layout>
      <section className="section-padding" aria-labelledby="contact-info-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactInfoSection />
            <div>
              <ContactFormSection
                loading={loading}
                success={success}
                onSubmit={handleSubmit}
                onResetSuccess={() => setSuccess(false)}
              />
              <ContactFAQSection />
            </div>
          </div>
        </div>
      </section>
      <Chatbot />
    </Layout>
  );
};

export default ContactPage;
