import { getTutorColorClasses, TutorTypeInfo } from './tutorRegistrationTypes';

interface TutorInfoSidebarProps {
  tutorInfo: TutorTypeInfo;
}

const PROCESS_STEPS = [
  'Tiếp nhận yêu cầu',
  'Tư vấn chi tiết',
  'Tìm Gia sư phù hợp',
  'Dạy thử miễn phí',
  'Bắt đầu học chính thức',
];

const TutorInfoSidebar = ({ tutorInfo }: TutorInfoSidebarProps) => {
  const colors = getTutorColorClasses(tutorInfo.color);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Thông tin Gia sư</h3>

      <div className={`mb-6 p-4 rounded-lg border ${colors.card}`}>
        <h4 className={`font-bold mb-2 ${colors.title}`}>{tutorInfo.name}</h4>
        <p className="text-black dark:text-white text-sm mb-3">{tutorInfo.description}</p>
        <div className={`text-2xl font-bold ${colors.price}`}>{tutorInfo.price}</div>
      </div>

      <div className="space-y-4">
        <div>
          <h5 className="font-semibold text-black dark:text-white mb-3">Quy trình</h5>
          <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step} className="flex items-start">
                <span className="text-blue-500 mr-2 font-medium">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="mb-1">✓ Dạy thử miễn phí 1 buổi đầu tiên</p>
        <p>✓ Đổi Gia sư miễn phí nếu không phù hợp</p>
      </div>
    </div>
  );
};

export default TutorInfoSidebar;
