import type { Metadata } from 'next';
import ContactPage from '@/components/screens/ContactScreen';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';

export const metadata: Metadata = buildMetadata(seoData.contact);

const ContactRoute = () => <ContactPage />;

export default ContactRoute;
