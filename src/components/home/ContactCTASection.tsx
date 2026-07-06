import Link from 'next/link';
import { Button } from '../ui/button';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { CENTER_INFO } from '../../constants/centerInfo';

const ContactCTASection = () => (
  <section
    id="contact-cta"
    className="section-padding bg-gradient-to-r from-primary to-primary-600 text-white relative overflow-hidden"
    aria-labelledby="contact-cta-heading"
  >
    {/* Background decoration */}
    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-5 rounded-full translate-y-24 -translate-x-24"></div>

    <div className="container-custom text-center relative z-10">
      <header className="mb-12">
        <h2 id="contact-cta-heading" className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Sẵn sàng bắt đầu hành trình học tập?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về các lớp học phù hợp nhất với
          nhu cầu của bạn hoặc con em của bạn.
        </p>
      </header>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <Button
          asChild
          variant="secondary"
          size="lg"
          className="px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Link
            href="/contact"
            className="flex items-center gap-2"
            aria-label="Liên hệ với trung tâm"
          >
            <MessageCircle className="w-5 h-5" />
            Liên hệ ngay
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="bg-white text-primary hover:bg-muted border-2 border-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Link
            href="/classes"
            className="flex items-center gap-2"
            aria-label="Xem danh sách lớp học"
          >
            <Calendar className="w-5 h-5" />
            Xem lớp học
          </Link>
        </Button>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-white">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          <span className="font-medium">Hotline: {CENTER_INFO.phonePrimary}</span>
        </div>
        <div className="hidden sm:block w-px h-6 bg-blue-200"></div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Tư vấn 24/7</span>
        </div>
      </div>
    </div>
  </section>
);

export default ContactCTASection;
