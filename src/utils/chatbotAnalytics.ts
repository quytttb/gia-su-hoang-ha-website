import { trackEvent } from './analytics';

// Chatbot interaction types
export type ChatbotEventType =
  | 'chatbot_open'
  | 'chatbot_close'
  | 'message_sent'
  | 'quick_reply_clicked'
  | 'course_inquiry'
  | 'contact_request'
  | 'faq_viewed'
  | 'conversation_ended';

// Track chatbot opening
export const trackChatbotOpen = () => {
  trackEvent('chatbot_open', 'engagement', 'chatbot_widget');
};

// Track chatbot closing
export const trackChatbotClose = (sessionDuration?: number) => {
  trackEvent('chatbot_close', 'engagement', 'chatbot_widget', sessionDuration);
};

// Track user message sent
export const trackMessageSent = (messageType: 'text' | 'quick_reply' = 'text') => {
  trackEvent('message_sent', 'chatbot', messageType);
};

// Track quick reply button clicks
export const trackQuickReplyClick = (replyText: string) => {
  trackEvent('quick_reply_clicked', 'chatbot', replyText);
};

// Track course inquiries through chatbot
export const trackCourseInquiry = (courseId?: string, courseName?: string) => {
  trackEvent('course_inquiry', 'chatbot', courseId ? `${courseId}-${courseName}` : 'general');
};

// Track contact requests through chatbot
export const trackContactRequest = (requestType: 'phone' | 'email' | 'address' | 'general') => {
  trackEvent('contact_request', 'chatbot', requestType);
};

// Track FAQ views
export const trackFAQViewed = (faqTopic: string) => {
  trackEvent('faq_viewed', 'chatbot', faqTopic);
};

// Track conversation flow
export const trackConversationStep = (step: string, flowType: string) => {
  trackEvent('conversation_step', 'chatbot', `${flowType}_${step}`);
};

// Track chatbot satisfaction
export const trackChatbotSatisfaction = (rating: number, feedback?: string) => {
  trackEvent('chatbot_satisfaction', 'feedback', `rating_${rating}`, rating);

  if (feedback) {
    trackEvent('chatbot_feedback', 'feedback', 'text_feedback');
  }
};

// Track chatbot errors
export const trackChatbotError = (errorType: string, errorMessage?: string) => {
  trackEvent('chatbot_error', 'error', errorType);

  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: `Chatbot Error: ${errorType} - ${errorMessage}`,
      fatal: false,
    });
  }
};

// Track chatbot performance
export const trackChatbotPerformance = (responseTime: number, messageCount: number) => {
  trackEvent('chatbot_performance', 'performance', 'response_time', responseTime);
  trackEvent('chatbot_performance', 'performance', 'message_count', messageCount);
};

// Track popular chatbot topics
export const trackPopularTopic = (topic: string, frequency: number) => {
  trackEvent('popular_topic', 'chatbot', topic, frequency);
};

// Track chatbot conversion
export const trackChatbotConversion = (
  conversionType: 'course_registration' | 'contact_form' | 'phone_call'
) => {
  trackEvent('chatbot_conversion', 'conversion', conversionType);
};

// Comprehensive chatbot session tracking
export interface ChatbotSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  messageCount: number;
  topicsDiscussed: string[];
  conversionsGenerated: string[];
  userSatisfaction?: number;
}

export const trackChatbotSession = (session: ChatbotSession) => {
  const duration = session.endTime ? session.endTime - session.startTime : 0;

  // Track session metrics
  trackEvent('chatbot_session_complete', 'chatbot', 'session_metrics', duration);

  // Track session details
  if (window.gtag) {
    window.gtag('event', 'chatbot_session_details', {
      session_duration: duration,
      message_count: session.messageCount,
      topics_count: session.topicsDiscussed.length,
      conversions_count: session.conversionsGenerated.length,
      satisfaction_rating: session.userSatisfaction || 0,
    });
  }
};
