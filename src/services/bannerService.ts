import { Banner } from '../types';
import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  Firestore,
  writeBatch,
} from 'firebase/firestore';

// Thêm kiểm tra db trước khi sử dụng
const bannersRef = db ? collection(db, 'banners') : null;

// Helper function to generate custom ID
function generateCustomId(title: string, order: number): string {
  // Slug the title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();

  // Format order with leading zeros (e.g., 01, 02, etc.)
  const orderStr = order.toString().padStart(2, '0');

  // Final format: banner-slug-order
  return `banner-${slug}-${orderStr}`;
}

export const bannerService = {
  // Get all banners
  async getAllBanners(): Promise<Banner[]> {
    if (!db || !bannersRef) return [];

    const q = query(bannersRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }) as Banner);
  },

  // Get active banners only
  async getActiveBanners(): Promise<Banner[]> {
    if (!db || !bannersRef) return [];

    const q = query(bannersRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }) as Banner)
      .filter(banner => banner.isActive);
  },

  // Get banner by ID
  async getBannerById(id: string): Promise<Banner | null> {
    if (!db) return null;

    const docRef = doc(db as Firestore, 'banners', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Banner;
  },

  // Create new banner with custom ID
  async createBanner(bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner> {
    if (!db) throw new Error('Firebase not initialized');

    const now = Timestamp.now();

    // Generate custom ID
    const customId = generateCustomId(bannerData.title, bannerData.order);

    // Use setDoc with custom ID instead of addDoc
    const docRef = doc(db as Firestore, 'banners', customId);
    await setDoc(docRef, {
      ...bannerData,
      createdAt: now,
      updatedAt: now,
    });

    const docSnap = await getDoc(docRef);
    return { id: customId, ...docSnap.data() } as Banner;
  },

  // Update banner
  async updateBanner(
    id: string,
    bannerData: Partial<Omit<Banner, 'id' | 'createdAt'>>
  ): Promise<Banner> {
    if (!db) throw new Error('Firebase not initialized');

    const docRef = doc(db as Firestore, 'banners', id);
    await updateDoc(docRef, {
      ...bannerData,
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() } as Banner;
  },

  // Delete banner
  async deleteBanner(id: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const docRef = doc(db as Firestore, 'banners', id);
    await deleteDoc(docRef);
  },

  // Toggle banner active status
  async toggleBannerActive(id: string, isActive: boolean): Promise<Banner> {
    return this.updateBanner(id, { isActive });
  },

  // Reorder banners
  async reorderBanners(banners: Banner[]): Promise<Banner[]> {
    if (!db) throw new Error('Firebase not initialized');

    const batch = writeBatch(db as Firestore);
    banners.forEach((banner, idx) => {
      const docRef = doc(db as Firestore, 'banners', banner.id);
      batch.update(docRef, { order: idx + 1, updatedAt: Timestamp.now() });
    });
    await batch.commit();
    return this.getAllBanners();
  },

  // Get next order number for new banner
  async getNextOrder(): Promise<number> {
    if (!db || !bannersRef) return 1;

    const q = query(bannersRef, orderBy('order', 'desc'));
    const snapshot = await getDocs(q);
    const maxOrder = snapshot.docs.length > 0 ? snapshot.docs[0].data().order || 0 : 0;
    return maxOrder + 1;
  },

  // Bulk operations
  async bulkUpdateBanners(
    updates: Array<{ id: string; data: Partial<Omit<Banner, 'id' | 'createdAt'>> }>
  ): Promise<Banner[]> {
    if (!db) throw new Error('Firebase not initialized');

    const batch = writeBatch(db as Firestore);
    updates.forEach(({ id, data }) => {
      const docRef = doc(db as Firestore, 'banners', id);
      batch.update(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    });
    await batch.commit();
    return this.getAllBanners();
  },

  // Reset to default data (for development)
  async resetBanners(): Promise<Banner[]> {
    if (!db || !bannersRef) throw new Error('Firebase not initialized');

    const batch = writeBatch(db as Firestore);
    const q = query(bannersRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    snapshot.docs.forEach(docSnap => {
      batch.delete(doc(db as Firestore, 'banners', docSnap.id));
    });
    await batch.commit();
    return this.getAllBanners();
  },

  // Initialize with sample banners
  async initializeSampleBanners(): Promise<Banner[]> {
    const existingBanners = await this.getAllBanners();
    if (existingBanners.length > 0) {
      console.log('Banners already exist, skipping initialization');
      return existingBanners;
    }

    const sampleBanners = [
      {
        imageUrl:
          'https://res.cloudinary.com/dobcvvl12/image/upload/v1706166853/classes/1706166852097_c0ivgxv6woc.jpg',
        title: 'Chào mừng đến với Gia Sư Hoàng Hà',
        subtitle: 'Nơi đào tạo và phát triển tài năng trẻ',
        link: '/classes',
        isActive: true,
        order: 1,
      },
      {
        imageUrl:
          'https://res.cloudinary.com/dobcvvl12/image/upload/v1706166883/classes/1706166882415_qyjgn5okg54.jpg',
        title: 'Khóa học mới - Toán nâng cao',
        subtitle: 'Chuẩn bị cho kỳ thi học sinh giỏi',
        link: '/classes',
        isActive: true,
        order: 2,
      },
      {
        imageUrl:
          'https://res.cloudinary.com/dobcvvl12/image/upload/v1706166916/classes/1706166915610_tl1ywzlqnx.jpg',
        title: 'Đăng ký ngay hôm nay',
        subtitle: 'Nhận ưu đãi 20% cho học viên mới',
        link: '/contact',
        isActive: false,
        order: 3,
      },
    ];

    const createdBanners: Banner[] = [];
    for (const bannerData of sampleBanners) {
      const created = await this.createBanner(bannerData);
      createdBanners.push(created);
    }

    console.log('✅ Sample banners initialized successfully');
    return createdBanners;
  },
};
