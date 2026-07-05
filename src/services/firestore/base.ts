import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  CollectionReference,
  getDocs,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  Query,
  QuerySnapshot,
  serverTimestamp,
  updateDoc,
  where,
  Firestore,
  Unsubscribe,
  DocumentSnapshot,
  WhereFilterOp,
  startAfter,
  QueryConstraint,
  WithFieldValue,
  PartialWithFieldValue,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FirestoreDocument } from '../../types/firestore';

export interface PaginationOptions {
  limit?: number;
  startAfter?: DocumentSnapshot;
}

export interface QueryOptions extends PaginationOptions {
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  where?: { field: string; operator: any; value: any }[];
}

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  lastDoc: DocumentSnapshot | null;
  total?: number;
  error: string | null;
}

export abstract class BaseFirestoreService<T extends FirestoreDocument> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Get collection reference
  protected getCollectionRef(): CollectionReference<DocumentData> | null {
    if (!db) {
      console.error('Firestore not initialized');
      return null;
    }

    return collection(db, this.collectionName);
  }

  // Get document reference
  protected getDocRef(id: string): DocumentReference<DocumentData> | null {
    if (!db) {
      console.error('Firestore not initialized');
      return null;
    }

    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('Invalid document ID:', id);
      return null;
    }

    console.log(`Getting doc ref for collection: ${this.collectionName}, ID: ${id}`);
    return doc(db as Firestore, this.collectionName, id);
  }

  // Create a new document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResponse<T>> {
    try {
      if (!db) throw new Error('Firestore not initialized');

      const collectionRef = this.getCollectionRef();
      if (!collectionRef) throw new Error('Collection reference is null');

      const now = serverTimestamp();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      } as WithFieldValue<Omit<T, 'id'>>;

      const docRef = await addDoc(collectionRef, docData);
      const newDoc = await getDoc(docRef);

      if (!newDoc.exists()) {
        throw new Error('Failed to create document');
      }

      return {
        data: { id: docRef.id, ...newDoc.data() } as T,
        error: null,
        loading: false,
      };
    } catch (error: any) {
      console.error(`Error creating ${this.collectionName}:`, error);
      return {
        data: null,
        error: error.message || 'Failed to create document',
        loading: false,
      };
    }
  }

  // Get document by ID
  async getById(id: string): Promise<ServiceResponse<T>> {
    try {
      if (!db) {
        return {
          data: null,
          error: 'Firestore not initialized',
          loading: false,
        };
      }

      const docRef = this.getDocRef(id);
      if (!docRef) {
        return {
          data: null,
          error: 'Document reference is null',
          loading: false,
        };
      }

      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          data: null,
          error: `${this.collectionName} with ID ${id} not found`,
          loading: false,
        };
      }

      return {
        data: { id: docSnap.id, ...docSnap.data() } as T,
        error: null,
        loading: false,
      };
    } catch (error: any) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      return {
        data: null,
        error: error.message || 'Failed to get document',
        loading: false,
      };
    }
  }

  // Update document
  async update(
    id: string,
    data: PartialWithFieldValue<Omit<T, 'id' | 'createdAt'>>
  ): Promise<ServiceResponse<T>> {
    try {
      if (!db) throw new Error('Firestore not initialized');

      const docRef = this.getDocRef(id);
      if (!docRef) throw new Error('Document reference is null');

      const updateData = {
        ...(data as any),
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);

      // Get updated document
      const updatedDoc = await getDoc(docRef);

      if (!updatedDoc.exists()) {
        throw new Error(`${this.collectionName} with ID ${id} not found after update`);
      }

      return {
        data: { id: updatedDoc.id, ...updatedDoc.data() } as T,
        error: null,
        loading: false,
      };
    } catch (error: any) {
      console.error(`Error updating ${this.collectionName}:`, error);
      return {
        data: null,
        error: error.message || 'Failed to update document',
        loading: false,
      };
    }
  }

  // Delete document
  async delete(id: string): Promise<ServiceResponse<boolean>> {
    try {
      if (!db) throw new Error('Firestore not initialized');

      const docRef = this.getDocRef(id);
      if (!docRef) throw new Error('Document reference is null');

      await deleteDoc(docRef);

      return {
        data: true,
        error: null,
        loading: false,
      };
    } catch (error: any) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      return {
        data: false,
        error: error.message || 'Failed to delete document',
        loading: false,
      };
    }
  }

  // Get all documents with optional query
  async getAll(options?: QueryOptions): Promise<PaginatedResponse<T>> {
    try {
      if (!db) {
        return {
          data: [],
          hasMore: false,
          lastDoc: null,
          error: 'Firestore not initialized',
        };
      }

      const collectionRef = this.getCollectionRef();
      if (!collectionRef) {
        return {
          data: [],
          hasMore: false,
          lastDoc: null,
          error: 'Collection reference is null',
        };
      }

      // Build query with filters, sorting, pagination
      let firestoreQuery: Query = collectionRef;

      // Add where clauses
      if (options?.where && options.where.length > 0) {
        options.where.forEach(clause => {
          firestoreQuery = query(
            firestoreQuery,
            where(clause.field, clause.operator as WhereFilterOp, clause.value)
          );
        });
      }

      // Add order by
      if (options?.orderBy && options.orderBy.length > 0) {
        options.orderBy.forEach(sort => {
          firestoreQuery = query(firestoreQuery, orderBy(sort.field, sort.direction));
        });
      }

      // Add pagination
      const pageSize = options?.limit || 10;
      firestoreQuery = query(firestoreQuery, limit(pageSize + 1)); // Get one extra to check if there are more results

      // Start after the last document if provided
      if (options?.startAfter) {
        firestoreQuery = query(firestoreQuery, startAfter(options.startAfter));
      }

      // Execute query
      const snapshot = await getDocs(firestoreQuery);

      // Process results
      const hasMore = snapshot.docs.length > pageSize;
      const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
      const lastDoc = docs.length > 0 ? docs[docs.length - 1] : null;

      // Map to return type
      const data = docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as unknown as T
      );

      return {
        data,
        hasMore,
        lastDoc,
        error: null,
      };
    } catch (error: any) {
      console.error(`Error getting all ${this.collectionName}:`, error);
      return {
        data: [],
        hasMore: false,
        lastDoc: null,
        error: error.message,
      };
    }
  }

  // Realtime subscription to a document
  subscribeToDoc(id: string, callback: (doc: T | null) => void): Unsubscribe {
    try {
      if (!db || !this.getDocRef(id)) {
        callback(null);
        return () => {};
      }

      const docRef = this.getDocRef(id);
      if (!docRef) {
        callback(null);
        return () => {};
      }

      return onSnapshot(
        docRef,
        (docSnap: DocumentSnapshot<DocumentData>) => {
          if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as T);
          } else {
            callback(null);
          }
        },
        (error: Error) => {
          console.error(`Error subscribing to ${this.collectionName}:`, error);
          callback(null);
        }
      );
    } catch (error: any) {
      console.error(`Error setting up subscription to ${this.collectionName}:`, error);
      callback(null);
      return () => {};
    }
  }

  // Real-time listener for collection
  subscribeToCollection(callback: (data: T[]) => void, options?: QueryOptions): Unsubscribe {
    try {
      if (!db) {
        callback([]);
        return () => {};
      }

      const collectionRef = this.getCollectionRef();
      if (!collectionRef) {
        callback([]);
        return () => {};
      }

      // Bắt đầu với collection reference
      let q: Query<DocumentData> = collectionRef;

      // Apply where clauses
      if (options?.where) {
        options.where.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        options.orderBy.forEach(({ field, direction }) => {
          q = query(q, orderBy(field, direction));
        });
      } else if (!options?.where) {
        // Only add default ordering if no where clause to avoid composite index requirements
        q = query(q, orderBy('createdAt', 'desc'));
      }

      // Apply limit
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      return onSnapshot(
        q,
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];
          callback(data);
        },
        (error: Error) => {
          console.error(`Error listening to ${this.collectionName} collection:`, error);
          callback([]);
        }
      );
    } catch (error: any) {
      console.error(`Error setting up collection subscription to ${this.collectionName}:`, error);
      callback([]);
      return () => {};
    }
  }

  // Count documents
  async count(
    whereClause?: { field: string; operator: any; value: any }[]
  ): Promise<ServiceResponse<number>> {
    try {
      if (!db) {
        return {
          data: 0,
          error: 'Firestore not initialized',
          loading: false,
        };
      }

      const collectionRef = this.getCollectionRef();
      if (!collectionRef) {
        return {
          data: 0,
          error: 'Collection reference is null',
          loading: false,
        };
      }

      // Bắt đầu với collection reference
      let q: Query<DocumentData> = collectionRef;

      if (whereClause) {
        whereClause.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      const querySnapshot = await getDocs(q);

      return {
        data: querySnapshot.size,
        error: null,
        loading: false,
      };
    } catch (error: any) {
      console.error(`Error counting ${this.collectionName}:`, error);
      return {
        data: 0,
        error: error.message || 'Failed to count documents',
        loading: false,
      };
    }
  }

  // Batch operations helper
  protected buildQuery(constraints: QueryConstraint[]): Query<DocumentData> | null {
    if (!db) return null;

    const collectionRef = this.getCollectionRef();
    if (!collectionRef) return null;

    return query(collectionRef, ...constraints);
  }

  // Real-time listener for query
  subscribeToQuery(
    whereClause: { field: string; operator: any; value: any }[],
    orderByClause: { field: string; direction: 'asc' | 'desc' }[] = [],
    callback: (data: T[]) => void
  ): Unsubscribe {
    try {
      if (!db) {
        callback([]);
        return () => {};
      }

      const collectionRef = this.getCollectionRef();
      if (!collectionRef) {
        callback([]);
        return () => {};
      }

      // Bắt đầu với collection reference
      let q: Query<DocumentData> = collectionRef;

      // Apply where clauses
      whereClause.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });

      // Apply ordering
      orderByClause.forEach(({ field, direction }) => {
        q = query(q, orderBy(field, direction));
      });

      return onSnapshot(
        q,
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];
          callback(data);
        },
        (error: Error) => {
          console.error(`Error listening to ${this.collectionName} query:`, error);
          callback([]);
        }
      );
    } catch (error: any) {
      console.error(`Error setting up query subscription to ${this.collectionName}:`, error);
      callback([]);
      return () => {};
    }
  }

  // Get filtered items with custom query
  async getFilteredItems(
    whereClause: { field: string; operator: any; value: any }[],
    orderByClause: { field: string; direction: 'asc' | 'desc' }[] = [],
    limitCount: number = 100
  ): Promise<ServiceResponse<T[]>> {
    try {
      if (!db) {
        return { data: [], error: 'Firestore not initialized', loading: false };
      }

      const collectionRef = this.getCollectionRef();
      if (!collectionRef) {
        return { data: [], error: 'Collection reference is null', loading: false };
      }

      // Bắt đầu với collection reference
      let q: Query<DocumentData> = collectionRef;

      // Apply where clauses
      whereClause.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });

      // Apply ordering
      orderByClause.forEach(({ field, direction }) => {
        q = query(q, orderBy(field, direction));
      });

      // Apply limit
      q = query(q, limit(limitCount));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      return { data, error: null, loading: false };
    } catch (error: any) {
      console.error(`Error getting filtered ${this.collectionName}:`, error);
      return {
        data: [],
        error: error.message || `Failed to get filtered ${this.collectionName}`,
        loading: false,
      };
    }
  }
}
