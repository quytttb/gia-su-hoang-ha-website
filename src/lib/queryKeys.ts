import type { ClassFilters } from '@/data/classes';
import type { ListPostsOptions } from '@/data/blog';

export const queryKeys = {
  classes: {
    all: ['classes'] as const,
    list: (filters?: ClassFilters) => ['classes', filters] as const,
    active: ['classes', 'active'] as const,
    admin: ['classes', 'admin'] as const,
    detail: (id: string) => ['classes', 'detail', id] as const,
  },
  tutors: {
    all: ['tutors'] as const,
    active: ['tutors', 'active'] as const,
    list: (activeOnly: boolean) => ['tutors', { activeOnly }] as const,
  },
  schedules: {
    all: ['schedules'] as const,
    dates: ['schedules', 'available-dates'] as const,
    byDate: (date: string) => ['schedules', 'by-date', date] as const,
    byClass: (classId: string) => ['schedules', 'class', classId] as const,
  },
  blogPosts: {
    all: ['blogPosts'] as const,
    list: (options?: ListPostsOptions) => ['blogPosts', options] as const,
    infinite: (options?: Omit<ListPostsOptions, 'cursor'>) =>
      ['blogPosts', 'infinite', options] as const,
    admin: (filter: Record<string, unknown>) => ['blogPosts', 'admin', filter] as const,
    detail: (slug: string) => ['blogPost', slug] as const,
    related: (postId: string) => ['blogPosts', 'related', postId] as const,
  },
  banners: {
    all: ['banners'] as const,
    active: ['banners', 'active'] as const,
  },
  settings: {
    centerInfo: ['centerInfo'] as const,
    gallery: ['galleryImages'] as const,
    siteAsset: (key: string) => ['siteAsset', key] as const,
  },
  centerInfo: ['centerInfo'] as const,
};
