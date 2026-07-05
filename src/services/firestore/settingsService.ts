import { doc, getDoc, setDoc, updateDoc, Firestore } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CenterInfo } from '../../types';

const SETTINGS_COLLECTION = 'settings';
const CENTER_INFO_DOC = 'center-info';

export interface FirestoreCenterInfo extends CenterInfo {
  lastUpdated: string;
}

class SettingsService {
  // Get center info
  async getCenterInfo(): Promise<CenterInfo> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return this.getDefaultCenterInfo();
      }

      const docRef = doc(db as Firestore, SETTINGS_COLLECTION, CENTER_INFO_DOC);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreCenterInfo;
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          address: data.address,
          phone: data.phone,
          email: data.email,
          history: data.history,
          mission: data.mission,
          vision: data.vision,
          slogan: data.slogan,
          workingHours: data.workingHours,
        };
      } else {
        // Return default center info if not found
        return this.getDefaultCenterInfo();
      }
    } catch (error) {
      console.error('Error fetching center info from Firestore:', error);
      // Return default center info on error
      return this.getDefaultCenterInfo();
    }
  }

  // Set/Update center info
  async setCenterInfo(centerInfo: CenterInfo): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return false;
      }

      const docRef = doc(db as Firestore, SETTINGS_COLLECTION, CENTER_INFO_DOC);
      const dataToSave: FirestoreCenterInfo = {
        ...centerInfo,
        lastUpdated: new Date().toISOString(),
      };

      await setDoc(docRef, dataToSave, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving center info to Firestore:', error);
      return false;
    }
  }

  // Update specific fields of center info
  async updateCenterInfo(updates: Partial<CenterInfo>): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return false;
      }

      const docRef = doc(db as Firestore, SETTINGS_COLLECTION, CENTER_INFO_DOC);
      await updateDoc(docRef, {
        ...updates,
        lastUpdated: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Error updating center info:', error);
      return false;
    }
  }

  // Get default center info (fallback)
  private getDefaultCenterInfo(): CenterInfo {
    return {
      id: 'center-1',
      name: 'Trung tâm Gia Sư Hoàng Hà',
      description:
        'Trung tâm Gia Sư Hoàng Hà tự hào là nơi cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa với đội ngũ giáo viên giàu kinh nghiệm và phương pháp giảng dạy hiện đại.',
      address: '265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ',
      phone: '0385.510.892 - 0962.390.161',
      email: 'lienhe@giasuhoangha.com',
      history:
        'Trung tâm Gia Sư Hoàng Hà được thành lập vào năm 2015 với mục tiêu ban đầu là cung cấp các dịch vụ gia sư cho học sinh tiểu học và THCS. Sau gần 10 năm hoạt động, chúng tôi đã mở rộng quy mô và phát triển thành một trung tâm giáo dục toàn diện, phục vụ học sinh từ mầm non đến THPT. Với sự tận tâm và chuyên nghiệp, chúng tôi đã đồng hành cùng hàng nghìn học sinh đạt được kết quả học tập xuất sắc và phát triển toàn diện.',
      mission:
        'Sứ mệnh của chúng tôi là cung cấp môi trường học tập chất lượng cao, hiệu quả và thân thiện, giúp học sinh phát triển toàn diện về kiến thức, kỹ năng và nhân cách. Chúng tôi cam kết mang đến phương pháp giảng dạy hiện đại, cá nhân hóa và phù hợp với từng học sinh.',
      vision:
        'Trở thành trung tâm gia sư hàng đầu tại Thanh Hóa và các tỉnh lân cận, được tin tưởng bởi phụ huynh và học sinh. Chúng tôi hướng tới việc xây dựng một hệ sinh thái giáo dục toàn diện, góp phần nâng cao chất lượng giáo dục và phát triển nguồn nhân lực chất lượng cao cho xã hội.',
      slogan: 'DẪN LỐI TRI THỨC - VỮNG BƯỚC TƯƠNG LAI',
      workingHours: {
        weekdays: '7:30 - 20:00',
        weekend: '8:00 - 17:00',
      },
    };
  }

  // Initialize center info in Firestore (one-time setup)
  async initializeCenterInfo(): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return false;
      }

      const docRef = doc(db as Firestore, SETTINGS_COLLECTION, CENTER_INFO_DOC);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const defaultInfo = this.getDefaultCenterInfo();
        await this.setCenterInfo(defaultInfo);
        console.log('✅ Center info initialized in Firestore');
        return true;
      } else {
        console.log('ℹ️ Center info already exists in Firestore');
        return true;
      }
    } catch (error) {
      console.error('Error initializing center info:', error);
      return false;
    }
  }
}

const settingsService = new SettingsService();
export default settingsService;
