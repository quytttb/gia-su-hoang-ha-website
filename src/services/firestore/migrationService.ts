import { collection, getDocs, doc, updateDoc, deleteField, Firestore } from 'firebase/firestore';
import { db } from '../../config/firebase';

class MigrationService {
  async migrateSchedulesToStudentPhones(): Promise<{
    success: boolean;
    message: string;
    migratedCount: number;
  }> {
    try {
      if (!db) {
        return { success: false, message: 'Firestore chưa được khởi tạo', migratedCount: 0 };
      }

      const schedulesRef = collection(db as Firestore, 'schedules');
      const snapshot = await getDocs(schedulesRef);

      let migratedCount = 0;

      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        const docRef = doc(db as Firestore, 'schedules', docSnapshot.id);

        const updateData: any = {};
        let needUpdate = false;

        // Chuyển đổi studentIds thành studentPhones nếu có
        if (data.studentIds && Array.isArray(data.studentIds)) {
          // Mapping đơn giản: chuyển student-X thành số điện thoại giả
          const studentPhones = data.studentIds.map((studentId: string, index: number) => {
            // Tạo số điện thoại giả từ studentId
            if (typeof studentId === 'string' && studentId.startsWith('student-')) {
              const num = studentId.replace('student-', '');
              return `0987654${num.padStart(3, '0')}`;
            }
            return `098765${(index + 1).toString().padStart(4, '0')}`;
          });

          updateData.studentPhones = studentPhones;
          updateData.studentIds = deleteField(); // Xóa trường cũ
          needUpdate = true;
        }

        // Thêm studentPhones rỗng nếu chưa có
        if (!data.studentPhones) {
          updateData.studentPhones = [];
          needUpdate = true;
        }

        // Thêm maxStudents nếu chưa có
        if (!data.maxStudents) {
          updateData.maxStudents = 10; // Mặc định 10 học viên
          needUpdate = true;
        }

        if (needUpdate) {
          await updateDoc(docRef, updateData);
          migratedCount++;
        }
      }

      return {
        success: true,
        message: `Migration thành công! Đã cập nhật ${migratedCount} lịch học.`,
        migratedCount,
      };
    } catch (error) {
      console.error('Error during migration:', error);
      return {
        success: false,
        message: `Lỗi khi migration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        migratedCount: 0,
      };
    }
  }
}

const migrationService = new MigrationService();
export default migrationService;
