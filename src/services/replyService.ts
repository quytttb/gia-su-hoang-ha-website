// Email reply service using EmailJS

export interface ReplyEmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  from_name?: string;
  reply_to?: string;
}

/**
 * Send reply email using EmailJS
 */
export const sendReplyEmail = async (params: ReplyEmailParams): Promise<void> => {
  try {
    // Check if EmailJS is loaded
    if (!window.emailjs) {
      throw new Error('EmailJS is not loaded');
    }

    const templateParams = {
      to_email: params.to_email,
      to_name: params.to_name,
      subject: params.subject,
      message: params.message,
      from_name: params.from_name || 'Trung tâm Gia sư Hoàng Hà',
      reply_to: params.reply_to || 'giasuhoangha@gmail.com',
    };

    // Send email using EmailJS
    // Note: You need to create a reply template in EmailJS dashboard
    const result = await window.emailjs.send(
      'service_contact_form', // Same service as contact form
      'template_reply', // New template for replies
      templateParams,
      'CYGfHqz7Kqr3Jb4Xm' // Same public key
    );

    console.log('Reply email sent successfully:', result);
  } catch (error) {
    console.error('Error sending reply email:', error);
    throw new Error('Failed to send reply email');
  }
};

// Declare emailjs type for TypeScript
declare global {
  interface Window {
    emailjs: any;
  }
}
