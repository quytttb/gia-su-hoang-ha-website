// Firebase Firestore utilities will be imported as needed
import { BaseFirestoreService, QueryOptions, ServiceResponse, PaginatedResponse } from './base';
import { FirestoreClass, COLLECTIONS } from '../../types/firestore';

export interface ClassFilters {
  level?: string;
  subject?: string;
  priceRange?: { min: number; max: number };
  isActive?: boolean;
}

export interface ClassStats {
  totalClasses: number;
  activeClasses: number;
  totalStudents: number;
  averagePrice: number;
  popularSubjects: { subject: string; count: number }[];
  recentEnrollments: number;
}

class ClassesService extends BaseFirestoreService<FirestoreClass> {
  constructor() {
    super(COLLECTIONS.CLASSES);
  }

  // Get classes with filters
  async getClasses(
    filters?: ClassFilters,
    options?: QueryOptions
  ): Promise<PaginatedResponse<FirestoreClass>> {
    try {
      const whereClause: { field: string; operator: any; value: any }[] = [];

      // Apply filters
      if (filters?.level) {
        whereClause.push({ field: 'level', operator: '==', value: filters.level });
      }

      if (filters?.isActive !== undefined) {
        whereClause.push({ field: 'isActive', operator: '==', value: filters.isActive });
      }

      if (filters?.subject) {
        whereClause.push({ field: 'subjects', operator: 'array-contains', value: filters.subject });
      }

      // Price range filter will be handled client-side for now
      // Firestore doesn't support range queries with other conditions easily

      const queryOptions: QueryOptions = {
        ...options,
        where: [...(options?.where || []), ...whereClause],
        orderBy: options?.orderBy || [
          { field: 'isActive', direction: 'desc' },
          { field: 'createdAt', direction: 'desc' },
        ],
      };

      const result = await this.getAll(queryOptions);

      // Client-side filtering for price range
      if (filters?.priceRange) {
        result.data = result.data.filter(classData => {
          // Price range filter
          if (filters.priceRange) {
            if (
              classData.price < filters.priceRange.min ||
              classData.price > filters.priceRange.max
            ) {
              return false;
            }
          }

          return true;
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error getting classes with filters:', error);
      return {
        data: [],
        hasMore: false,
        lastDoc: null,
        error: error.message || 'Failed to get classes',
      };
    }
  }

  // Get active classes only
  async getActiveClasses(
    filters?: ClassFilters,
    options?: QueryOptions
  ): Promise<PaginatedResponse<FirestoreClass>> {
    return this.getClasses({ ...filters, isActive: true }, options);
  }

  // Get classes by subject
  async getClassesBySubject(
    subject: string,
    options?: QueryOptions
  ): Promise<PaginatedResponse<FirestoreClass>> {
    return this.getClasses({ subject, isActive: true }, options);
  }

  // Get classes by level
  async getClassesByLevel(
    level: string,
    options?: QueryOptions
  ): Promise<PaginatedResponse<FirestoreClass>> {
    return this.getClasses({ level, isActive: true }, options);
  }

  // Search classes by title or description
  async searchClasses(
    searchTerm: string,
    options?: QueryOptions
  ): Promise<PaginatedResponse<FirestoreClass>> {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation that can be enhanced with Algolia or similar
    const allClasses = await this.getActiveClasses({}, options);

    if (!searchTerm.trim()) {
      return allClasses;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filteredClasses = allClasses.data.filter(
      classData =>
        classData.title.toLowerCase().includes(searchTermLower) ||
        classData.description.toLowerCase().includes(searchTermLower) ||
        (classData.subjects &&
          classData.subjects.some((subject: string) =>
            subject.toLowerCase().includes(searchTermLower)
          ))
    );

    return {
      ...allClasses,
      data: filteredClasses,
    };
  }

  // Toggle class active status
  async toggleActiveStatus(classId: string): Promise<ServiceResponse<FirestoreClass>> {
    try {
      const classResult = await this.getById(classId);
      if (!classResult.data) {
        return {
          data: null,
          error: 'Class not found',
          loading: false,
        };
      }

      return await this.update(classId, { isActive: !classResult.data.isActive });
    } catch (error: any) {
      console.error('Error toggling class status:', error);
      return {
        data: null,
        error: error.message || 'Failed to toggle class status',
        loading: false,
      };
    }
  }

  // Get class statistics
  async getClassStats(): Promise<ServiceResponse<ClassStats>> {
    try {
      const allClasses = await this.getAll({ limit: 1000 }); // Get reasonable limit

      if (!allClasses.data) {
        return {
          data: null,
          error: 'Failed to get classes for statistics',
          loading: false,
        };
      }

      const classes = allClasses.data;
      const activeClasses = classes.filter(c => c.isActive);

      // Calculate statistics
      const averagePrice =
        classes.length > 0 ? classes.reduce((sum, c) => sum + c.price, 0) / classes.length : 0;

      // Get popular subjects
      const subjectCounts: { [key: string]: number } = {};
      classes.forEach(c => {
        c.subjects?.forEach((subject: string) => {
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });
      });

      const popularSubjects = Object.entries(subjectCounts)
        .map(([subject, count]) => ({ subject, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentEnrollments = classes.filter(
        c => c.createdAt && c.createdAt.toDate() > thirtyDaysAgo
      ).length;

      const stats: ClassStats = {
        totalClasses: classes.length,
        activeClasses: activeClasses.length,
        totalStudents: 0, // Removed enrollment tracking
        averagePrice,
        popularSubjects,
        recentEnrollments,
      };

      return {
        data: stats,
        error: null,
        loading: false,
      };
    } catch (error: any) {
      console.error('Error getting class statistics:', error);
      return {
        data: null,
        error: error.message || 'Failed to get class statistics',
        loading: false,
      };
    }
  }

  // Duplicate class
  async duplicateClass(
    classId: string,
    newTitle?: string
  ): Promise<ServiceResponse<FirestoreClass>> {
    try {
      const originalClass = await this.getById(classId);
      if (!originalClass.data) {
        return {
          data: null,
          error: 'Class not found',
          loading: false,
        };
      }

      const {
        id: _id,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        ...classData
      } = originalClass.data;
      const duplicatedClass = {
        ...classData,
        title: newTitle || `${classData.title} (Copy)`,
        isActive: false, // Start as inactive
      };

      return await this.create(duplicatedClass);
    } catch (error: any) {
      console.error('Error duplicating class:', error);
      return {
        data: null,
        error: error.message || 'Failed to duplicate class',
        loading: false,
      };
    }
  }

  // Get classes for admin (including inactive)
  async getAdminClasses(options?: QueryOptions): Promise<PaginatedResponse<FirestoreClass>> {
    const queryOptions: QueryOptions = {
      ...options,
      orderBy: options?.orderBy || [
        { field: 'isActive', direction: 'desc' },
        { field: 'updatedAt', direction: 'desc' },
      ],
    };

    return this.getAll(queryOptions);
  }

  // Real-time subscription for active classes
  subscribeToActiveClasses(callback: (classes: any[]) => void) {
    return this.subscribeToCollection(callback, {
      where: [{ field: 'isActive', operator: '==', value: true }],
    });
  }

  // Real-time subscription for admin classes
  subscribeToClassesForAdmin(callback: (classes: any[]) => void) {
    return this.subscribeToCollection(callback, {
      orderBy: [{ field: 'updatedAt', direction: 'desc' }],
    });
  }
}

// Create and export singleton instance
const classesService = new ClassesService();
export default classesService;
