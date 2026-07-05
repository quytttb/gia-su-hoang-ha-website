import { useEffect, useState } from 'react';
import classesService, { ClassStats } from '../../services/firestore/classesService';
import { FirestoreClass } from '../../types/firestore';

const ClassesStats = () => {
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [classes, setClasses] = useState<FirestoreClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Set up real-time listener for classes
    const unsubscribe = classesService.subscribeToClassesForAdmin((classesData: any[]) => {
      setClasses(classesData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Calculate stats whenever classes change
    const calculateStats = async () => {
      try {
        setLoading(true);
        const result = await classesService.getClassStats();
        if (result.data) {
          setStats(result.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error calculating stats:', error);
        setLoading(false);
      }
    };

    if (classes.length > 0) {
      calculateStats();
    }
  }, [classes]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6 transition-colors duration-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6 transition-colors duration-200">
        <div className="text-red-500 dark:text-red-400 text-center">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Thống kê lớp học</h2>
        <div className="flex items-center text-green-500 dark:text-green-400 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Real-time
        </div>
      </div>

      {stats && (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalClasses}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tổng lớp học</div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.activeClasses}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Đang hoạt động</div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalStudents}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tổng học viên</div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {new Intl.NumberFormat('vi-VN').format(Math.round(stats.averagePrice))}đ
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Giá trung bình</div>
            </div>
          </div>

          {/* Popular Subjects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Môn học phổ biến
              </h3>
              <div className="space-y-2">
                {stats.popularSubjects.slice(0, 5).map(subject => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{subject.subject}</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full"
                          style={{
                            width: `${(subject.count / stats.popularSubjects[0].count) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {subject.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Hoạt động gần đây
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-700 dark:text-gray-300">Đăng ký mới (30 ngày)</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {stats.recentEnrollments}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-700 dark:text-gray-300">Lớp học được cập nhật</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {
                      classes.filter(c => {
                        const updatedAt = c.updatedAt?.toDate();
                        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                        return updatedAt && updatedAt > oneDayAgo;
                      }).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassesStats;
