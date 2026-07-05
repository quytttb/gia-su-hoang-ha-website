import type { Metadata } from 'next';
import ContactPage from '@/pages/ContactPage';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';

export const metadata: Metadata = buildMetadata(seoData.contact);

const ContactRoute = () => <ContactPage />;

export default ContactRoute;
