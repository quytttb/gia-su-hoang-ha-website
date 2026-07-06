import { Class } from '../types';

// Fixed categories list
export const FIXED_CATEGORIES = ['Tiền tiểu học', 'Toán', 'Văn'];

/** Map a class record (DB or API) to the Class type. */
export const mapClassRecord = (record: Record<string, unknown>): Class => {
  if (!record) {
    throw new Error('Invalid class data');
  }

  if (!record.id) {
    throw new Error('Missing class ID');
  }

  return {
    id: record.id as string,
    name: (record.name as string) || (record.title as string) || 'Lớp học',
    description: (record.description as string) || '',
    targetAudience: (record.targetAudience as string) || 'Học sinh',
    schedule: (record.schedule as string) || 'Linh hoạt',
    price: (record.price as number) || 0,
    imageUrl:
      (record.imageUrl as string) || (record.image as string) || '/images/default-class.jpg',
    featured: record.featured !== undefined ? Boolean(record.featured) : false,
    category: (record.category as string) || 'Khác',
    discount: record.discount as number | undefined,
    discountEndDate: record.discountEndDate as string | undefined,
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
