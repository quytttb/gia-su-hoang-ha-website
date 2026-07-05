import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: any;
  updatedAt: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Save contact message to Firestore
 */
export const saveContactMessage = async (
  name: string,
  email: string,
  phone: string,
  message: string
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    const contactData: Omit<ContactMessage, 'id'> = {
      name,
      email,
      phone,
      message,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
    };

    const docRef = await addDoc(collection(db, 'contacts'), contactData);

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error saving contact message:', error);
    return {
      success: false,
      error: 'Không thể lưu tin nhắn vào cơ sở dữ liệu',
    };
  }
};

/**
 * Get basic contact statistics (for admin dashboard)
 */
export const getContactStats = async () => {
  return {
    total: 0,
    new: 0,
    replied: 0,
  };
};
