import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { BlogPost } from '../types';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  increment,
} from 'firebase/firestore';
import slugifyLib from 'slugify';
import { db as firebaseDb } from '@/config/firebase';

// Utility functions
export const slugify = (title: string): string => {
  return slugifyLib(title, { lower: true, strict: true, locale: 'vi' });
};

export const computeReadTime = (markdown: string): number => {
  const words = markdown
    .replace(/[#*_`>-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const minutes = Math.ceil(words.length / 200);
  return Math.max(1, minutes);
};

export const extractExcerpt = (markdown: string, length: number = 160): string => {
  const text = markdown
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/`[^`]*`/g, '') // inline code
    .replace(/[#>*_-]/g, ' ') // markdown syntax
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
  return text.slice(0, length).trim();
};

export interface CreatePostInput {
  title: string;
  subtitle?: string;
  contentMarkdown: string;
  excerpt?: string;
  authorName: string;
  categoryId: string;
  tags: string[];
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  coverImage?: { url: string; publicId?: string };
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
}

export interface ListPostsOptions {
  pageSize?: number;
  categoryId?: string;
  tag?: string;
  status?: 'draft' | 'published' | 'archived';
  sort?: 'latest' | 'popular';
  cursor?: any; // Firestore document snapshot
}

const POSTS_COLLECTION = 'blogPosts';

const getDb = () => {
  if (!firebaseDb) {
    throw new Error('Firebase Firestore is not initialized');
  }
  return firebaseDb;
};

export class BlogService {
  static db = getDb();

  static async ensureUniqueSlug(base: string): Promise<string> {
    let candidate = base;
    let idx = 1;
    while (true) {
      const qSnap = await getDocs(
        query(collection(this.db, POSTS_COLLECTION), where('slug', '==', candidate), limit(1))
      );
      if (qSnap.empty) return candidate;
      idx += 1;
      candidate = `${base}-${idx}`;
    }
  }

  static markdownToHtml(md: string): string {
    const parsed = marked.parse(md);
    const raw = typeof parsed === 'string' ? parsed : '';
    try {
      return DOMPurify.sanitize(raw);
    } catch {
      return raw;
    }
  }

  static normalizeTags(tags: string[]): string[] {
    return Array.from(new Set(tags.map(t => t.trim().toLowerCase()).filter(Boolean))).slice(0, 10);
  }

  static async createPost(input: CreatePostInput): Promise<string> {
    const slugBase = slugify(input.title);
    const slug = await this.ensureUniqueSlug(slugBase);
    const tags = this.normalizeTags(input.tags);
    const readTime = computeReadTime(input.contentMarkdown);
    const contentHtml = this.markdownToHtml(input.contentMarkdown);
    const excerpt = input.excerpt?.trim() || extractExcerpt(input.contentMarkdown);

    const nowStatus = input.status || 'draft';

    const ref = await addDoc(collection(this.db, POSTS_COLLECTION), {
      title: input.title,
      subtitle: input.subtitle || '',
      slug,
      contentMarkdown: input.contentMarkdown,
      contentHtml,
      excerpt,
      authorName: input.authorName,
      categoryId: input.categoryId,
      tags,
      status: nowStatus,
      featured: !!input.featured,
      coverImage: input.coverImage || null,
      readTime,
      viewCount: 0,
      seo: input.seo || {},
      publishedAt: nowStatus === 'published' ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  }

  static async updatePost(
    id: string,
    updates: Partial<CreatePostInput & { status: 'draft' | 'published' | 'archived' }>
  ): Promise<void> {
    const ref = doc(this.db, POSTS_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Post not found');

    const data: any = {};
    if (updates.title) data.title = updates.title; // slug immutable MVP
    if (updates.subtitle !== undefined) data.subtitle = updates.subtitle;
    if (updates.contentMarkdown !== undefined) {
      data.contentMarkdown = updates.contentMarkdown;
      data.contentHtml = this.markdownToHtml(updates.contentMarkdown);
      data.readTime = computeReadTime(updates.contentMarkdown);
      data.excerpt = updates.excerpt?.trim() || extractExcerpt(updates.contentMarkdown);
    } else if (updates.excerpt) {
      data.excerpt = updates.excerpt.trim();
    }
    if (updates.categoryId) data.categoryId = updates.categoryId;
    if (updates.tags) data.tags = this.normalizeTags(updates.tags);
    if (updates.featured !== undefined) data.featured = updates.featured;
    if (updates.coverImage !== undefined) data.coverImage = updates.coverImage;
    if (updates.seo) data.seo = updates.seo;
    if (updates.status) {
      data.status = updates.status;
      if (updates.status === 'published' && !snap.data().publishedAt) {
        data.publishedAt = serverTimestamp();
      }
    }
    data.updatedAt = serverTimestamp();

    await updateDoc(ref, data);
  }

  static async publishPost(id: string): Promise<void> {
    await this.updatePost(id, { status: 'published' as const });
  }

  static async deletePost(id: string): Promise<void> {
    const ref = doc(this.db, POSTS_COLLECTION, id);
    // Hard delete alternative: change to archived if needed
    // import { deleteDoc } from 'firebase/firestore'; await deleteDoc(ref);
    await updateDoc(ref, { status: 'archived', updatedAt: serverTimestamp() });
  }

  static async getPostBySlug(slug: string, includeDraft = false): Promise<BlogPost | null> {
    const constraints: any[] = [where('slug', '==', slug)];
    if (!includeDraft) constraints.push(where('status', '==', 'published'));
    constraints.push(limit(1));

    let qSnap = await getDocs(query(collection(this.db, POSTS_COLLECTION), ...constraints));
    // Fallback: if includeDraft=false yielded nothing, try without status to handle inconsistent data,
    // but still prefer a published document if present among duplicates.
    if (qSnap.empty && !includeDraft) {
      const altSnap = await getDocs(
        query(collection(this.db, POSTS_COLLECTION), where('slug', '==', slug), limit(5))
      );
      if (altSnap.empty) return null;
      // Try pick a published one first
      const publishedDoc = altSnap.docs.find(d => (d.data() as any).status === 'published');
      const chosen = publishedDoc || altSnap.docs[0];
      const data = chosen.data() as any;
      if (!includeDraft && data.status !== 'published') return null;
      return { id: chosen.id, ...data } as BlogPost;
    }
    if (qSnap.empty) return null;
    const docSnap = qSnap.docs[0];
    const data = docSnap.data() as any;
    if (!includeDraft && data.status !== 'published') return null;
    return { id: docSnap.id, ...data } as BlogPost;
  }

  static async getPostById(id: string, includeDraft = false): Promise<BlogPost | null> {
    try {
      const ref = doc(this.db, POSTS_COLLECTION, id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const data = snap.data() as any;
      if (!includeDraft && data.status !== 'published') return null;
      return { id: snap.id, ...data } as BlogPost;
    } catch {
      return null;
    }
  }

  static async incrementViewCount(id: string): Promise<void> {
    const ref = doc(this.db, POSTS_COLLECTION, id);
    await updateDoc(ref, { viewCount: increment(1) });
  }

  static async listPosts(
    opts: ListPostsOptions = {}
  ): Promise<{ posts: BlogPost[]; cursor: any | null }> {
    const pageSize = opts.pageSize || 10;
    const constraints: any[] = [];

    if (opts.status) {
      constraints.push(where('status', '==', opts.status));
    } else {
      constraints.push(where('status', '==', 'published'));
    }

    if (opts.categoryId) constraints.push(where('categoryId', '==', opts.categoryId));
    if (opts.tag) constraints.push(where('tags', 'array-contains', opts.tag));

    if (opts.sort === 'popular') {
      constraints.push(orderBy('viewCount', 'desc'));
    } else {
      constraints.push(orderBy('publishedAt', 'desc'));
    }

    constraints.push(limit(pageSize));
    if (opts.cursor) constraints.push(startAfter(opts.cursor));

    const q = query(collection(this.db, POSTS_COLLECTION), ...constraints);
    const snap = await getDocs(q);

    const posts = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as BlogPost[];
    const newCursor = snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null;
    return { posts, cursor: newCursor };
  }
}
