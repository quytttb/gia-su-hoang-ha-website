import React from 'react';
import { Registration } from '../../../types';
import { Badge } from '../../ui/badge';
import { formatDate } from '../../../utils/helpers';
import { User, Phone, MapPin, Book, Calendar, FileText } from 'lucide-react';

interface RegistrationDetailProps {
  registration: Registration;
}

const statusConfig = {
  pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800' },
  completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800' },
  matched: { label: 'Đã ghép lớp', color: 'bg-purple-100 text-purple-800' },
  trial_scheduled: { label: 'Đã xếp lịch học thử', color: 'bg-indigo-100 text-indigo-800' },
};

const RegistrationDetail: React.FC<RegistrationDetailProps> = ({ registration }) => {
  return (
    <div className="space-y-6">
      {/* Header với status */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Mã đăng ký: {registration.id}</h3>
          <p className="text-sm text-muted-foreground">
            Đăng ký ngày: {formatDate(registration.registrationDate)}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={statusConfig[registration.status]?.color}>
            {statusConfig[registration.status]?.label}
          </Badge>
        </div>
      </div>

      {/* Student and Parent Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Thông tin học viên
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                <span className="font-medium">Họ tên:</span> {registration.studentName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                <span className="font-medium">SĐT:</span> {registration.studentPhone}
              </span>
            </div>
            {registration.studentSchool && (
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  <span className="font-medium">Trường học:</span> {registration.studentSchool}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Parent Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Thông tin phụ huynh
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                <span className="font-medium">Họ tên:</span> {registration.parentName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                <span className="font-medium">SĐT:</span> {registration.parentPhone}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm text-foreground">
                <span className="font-medium">Địa chỉ:</span> {registration.parentAddress}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <Book className="h-4 w-4" />
          Thông tin lớp học
        </h4>
        <div className="space-y-3 pl-6">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              <span className="font-medium">Lớp học:</span>{' '}
              {registration.className || 'Chưa xác định'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              <span className="font-medium">Lịch mong muốn:</span> {registration.preferredSchedule}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {registration.notes && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Mô tả lực học
          </h4>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              {registration.notes}
            </p>
          </div>
        </div>
      )}

      {/* Tutor Criteria for tutor registrations */}
      {registration.tutorCriteria && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Mô tả tiêu chí tìm Gia sư
          </h4>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              {registration.tutorCriteria}
            </p>
          </div>
        </div>
      )}

      {/* Approval/Rejection Information */}
      {(registration.approvedBy || registration.rejectionReason) && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Thông tin xử lý</h4>
          <div className="pl-6 space-y-2">
            {registration.approvedBy && (
              <div className="text-sm text-foreground">
                <span className="font-medium">Xử lý bởi:</span>{' '}
                {registration.approvedByName || registration.approvedBy}
              </div>
            )}
            {registration.approvedAt && (
              <div className="text-sm text-foreground">
                <span className="font-medium">Thời gian:</span>{' '}
                {formatDate(registration.approvedAt)}
              </div>
            )}
            {registration.rejectionReason && (
              <div className="text-sm">
                <span className="font-medium">Lý do từ chối:</span>
                <p className="mt-1 p-2 bg-red-50 text-red-700 rounded text-xs">
                  {registration.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationDetail;
