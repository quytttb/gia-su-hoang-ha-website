import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Firestore,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Tutor } from '../../types';

const TUTORS_COLLECTION = 'tutors';

export interface FirestoreTutor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  experience: string;
  education: string;
  imageUrl: string;
  subjects: string[];
  availability: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class TutorsService {
  // Get collection reference
  private getTutorsRef(): CollectionReference<DocumentData> | null {
    if (!db) return null;
    return collection(db as Firestore, TUTORS_COLLECTION);
  }

  // Get all tutors
  async getAllTutors(): Promise<Tutor[]> {
    try {
      const tutorsRef = this.getTutorsRef();
      if (!tutorsRef) {
        console.error('Firestore not initialized');
        return [];
      }

      const snapshot = await getDocs(tutorsRef);
      return snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreTutor;
        return this.convertFirestoreTutor({ ...data, id: doc.id });
      });
    } catch (error) {
      console.error('Error fetching tutors:', error);
      return [];
    }
  }

  // Get active tutors only
  async getActiveTutors(): Promise<Tutor[]> {
    try {
      const tutorsRef = this.getTutorsRef();
      if (!tutorsRef) {
        console.error('Firestore not initialized');
        return [];
      }

      const q = query(tutorsRef, where('isActive', '==', true), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreTutor;
        return this.convertFirestoreTutor({ ...data, id: doc.id });
      });
    } catch (error) {
      console.error('Error fetching active tutors:', error);
      return [];
    }
  }

  // Subscribe to active tutors (real-time)
  subscribeToActiveTutors(callback: (tutors: Tutor[]) => void): () => void {
    const tutorsRef = this.getTutorsRef();
    if (!tutorsRef) {
      console.error('Firestore not initialized');
      callback([]);
      return () => {};
    }

    const q = query(tutorsRef, where('isActive', '==', true), orderBy('name', 'asc'));

    return onSnapshot(
      q,
      snapshot => {
        const tutors = snapshot.docs.map(doc => {
          const data = doc.data() as FirestoreTutor;
          return this.convertFirestoreTutor({ ...data, id: doc.id });
        });
        callback(tutors);
      },
      error => {
        console.error('Error in tutors subscription:', error);
        callback([]); // Return empty array on error
      }
    );
  }

  // Get tutor by ID
  async getTutorById(id: string): Promise<Tutor | null> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return null;
      }

      const docRef = doc(db as Firestore, TUTORS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data() as FirestoreTutor;
      return this.convertFirestoreTutor({ ...data, id: docSnap.id });
    } catch (error) {
      console.error('Error fetching tutor:', error);
      return null;
    }
  }

  // Add new tutor
  async addTutor(
    tutorData: Omit<FirestoreTutor, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string | null> {
    try {
      const tutorsRef = this.getTutorsRef();
      if (!tutorsRef) {
        console.error('Firestore not initialized');
        return null;
      }

      const now = new Date().toISOString();
      const docRef = await addDoc(tutorsRef, {
        ...tutorData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding tutor:', error);
      return null;
    }
  }

  // Update tutor
  async updateTutor(
    id: string,
    updates: Partial<Omit<FirestoreTutor, 'id' | 'createdAt'>>
  ): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return false;
      }

      const docRef = doc(db as Firestore, TUTORS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Error updating tutor:', error);
      return false;
    }
  }

  // Delete tutor
  async deleteTutor(id: string): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return false;
      }

      const docRef = doc(db as Firestore, TUTORS_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting tutor:', error);
      return false;
    }
  }

  // Helper: Convert Firestore tutor to Tutor type
  private convertFirestoreTutor(firestoreTutor: FirestoreTutor): Tutor {
    return {
      id: firestoreTutor.id,
      name: firestoreTutor.name,
      specialty: firestoreTutor.specialty,
      bio: firestoreTutor.bio,
      imageUrl: firestoreTutor.imageUrl,
    };
  }
}

const tutorsService = new TutorsService();
export default tutorsService;
