import { Class } from '../types';

// Fixed categories list
export const FIXED_CATEGORIES = ['Tiền tiểu học', 'Toán', 'Văn'];

/**
 * Convert Firestore class data to Class type
 * Handles both old and new data structures
 */
export const convertFirestoreClass = (firestoreClass: any): Class => {
  if (!firestoreClass) {
    console.error('convertFirestoreClass: firestoreClass is null or undefined');
    throw new Error('Invalid firestore class data');
  }

  if (!firestoreClass.id) {
    console.error('convertFirestoreClass: missing ID', firestoreClass);
    throw new Error('Missing class ID');
  }

  return {
    id: firestoreClass.id,
    name: firestoreClass.name || firestoreClass.title || 'Lớp học',
    description: firestoreClass.description || '',
    targetAudience: firestoreClass.targetAudience || 'Học sinh',
    schedule: firestoreClass.schedule || 'Linh hoạt',
    price: firestoreClass.price || 0,
    imageUrl: firestoreClass.imageUrl || firestoreClass.image || '/images/default-class.jpg',
    featured: firestoreClass.featured !== undefined ? firestoreClass.featured : false,
    category: firestoreClass.category || 'Khác',
    // Handle discount fields
    discount: firestoreClass.discount,
    discountEndDate: firestoreClass.discountEndDate,
  };
};

/**
 * Get fixed categories list
 */
export const extractClassCategories = (): string[] => {
  return FIXED_CATEGORIES;
};

/**
 * Filter classes by category
 */
export const filterClassesByCategory = (classes: Class[], category: string): Class[] => {
  if (category === 'all') {
    return classes;
  }
  return classes.filter(classData => classData.category === category);
};

/**
 * Get featured classes only
 */
export const getFeaturedClasses = (classes: Class[], limit?: number): Class[] => {
  const featured = classes.filter(classData => classData.featured);
  return limit ? featured.slice(0, limit) : featured;
};
