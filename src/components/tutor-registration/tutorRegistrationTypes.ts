export interface TutorTypeInfo {
  name: string;
  price: string;
  description: string;
  color: 'blue' | 'green';
}

export interface TutorRegistrationFormData {
  parentName: string;
  parentPhone: string;
  parentAddress: string;
  name: string;
  school: string;
  academicDescription: string;
  tutorCriteria: string;
}

const colorClasses = {
  blue: {
    card: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    title: 'text-blue-600 dark:text-blue-400',
    price: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    card: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    title: 'text-green-600 dark:text-green-400',
    price: 'text-green-600 dark:text-green-400',
  },
} as const;

export function getTutorColorClasses(color: TutorTypeInfo['color']) {
  return colorClasses[color];
}
