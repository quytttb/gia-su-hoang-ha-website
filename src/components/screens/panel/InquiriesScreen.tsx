import React, { useState, useEffect } from 'react';
import {
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
  type ContactMessage,
} from '@/actions/contact-admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/useNotificationStore';
import {
  Mail,
  MailOpen,
  Trash2,
  Eye,
  EyeOff,
  Phone,
  User,
  Calendar,
  Reply,
  Send,
  X,
  Loader2,
} from 'lucide-react';
import SkeletonLoading from '@/components/shared/SkeletonLoading';
import StatusBadge from '@/components/shared/StatusBadge';
import { contactStatusConfig } from '@/lib/ui/status-badges';
import { sendReplyEmail } from '@/services/replyService';
import { toast } from 'sonner';

type FilterKey = 'all' | ContactMessage['status'];

const InquiriesScreen: React.FC = () => {
  const [messages, setMessages] = useState<(ContactMessage & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<(ContactMessage & { id: string }) | null>(
    null
  );
  const [filter, setFilter] = useState<FilterKey>('all');
  const refreshNotifications = useNotificationStore(state => state.refreshNotifications);

  const [isReplying, setIsReplying] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getContactMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateMessageStatus = async (messageId: string, status: ContactMessage['status']) => {
    try {
      const result = await updateContactStatus(messageId, status);
      if (!result.success || !result.data) return;

      setMessages(prev =>
        prev.map(msg => (msg.id === messageId ? { ...msg, status: result.data!.status } : msg))
      );

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(prev => (prev ? { ...prev, status: result.data!.status } : null));
      }

      refreshNotifications();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;

    try {
      const result = await deleteContactMessage(messageId);
      if (!result.success) return;
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSelectedMessage(null);
      toast.success('Đã xóa tin nhắn');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Không thể xóa tin nhắn');
    }
  };

  const handleMessageClick = async (message: ContactMessage & { id: string }) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      await updateMessageStatus(message.id, 'read');
    }
  };

  const toggleReadStatus = async (messageId: string, currentStatus: ContactMessage['status']) => {
    const newStatus = currentStatus === 'new' ? 'read' : 'new';
    await updateMessageStatus(messageId, newStatus);
  };

  const startReply = (message: ContactMessage & { id: string }) => {
    setIsReplying(true);
    setReplySubject(`Re: Yêu cầu từ ${message.name}`);
    setReplyMessage(`Xin chào ${message.name},\n\nCảm ơn bạn đã liên hệ với chúng tôi.\n\n`);
  };

  const cancelReply = () => {
    setIsReplying(false);
    setReplySubject('');
    setReplyMessage('');
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) return;

    setSendingReply(true);
    try {
      await sendReplyEmail({
        to_email: selectedMessage.email,
        to_name: selectedMessage.name,
        subject: replySubject,
        message: replyMessage,
      });

      await updateMessageStatus(selectedMessage.id, 'replied');
      cancelReply();
      toast.success('Đã gửi phản hồi thành công!');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại.');
    } finally {
      setSendingReply(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return 'N/A';

    let date: Date;
    if (
      typeof timestamp === 'object' &&
      timestamp !== null &&
      'toDate' in timestamp &&
      typeof (timestamp as { toDate: () => Date }).toDate === 'function'
    ) {
      date = (timestamp as { toDate: () => Date }).toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp as string | number);
    }

    return date.toLocaleString('vi-VN');
  };

  const filterTabs = [
    { key: 'all' as const, label: 'Tất cả', count: messages.length },
    { key: 'new' as const, label: 'Mới', count: messages.filter(m => m.status === 'new').length },
    {
      key: 'read' as const,
      label: 'Đã đọc',
      count: messages.filter(m => m.status === 'read').length,
    },
    {
      key: 'replied' as const,
      label: 'Đã trả lời',
      count: messages.filter(m => m.status === 'replied').length,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Tin nhắn</h2>
          <p className="text-muted-foreground">
            Xem và trả lời các tin nhắn, yêu cầu từ khách hàng.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Tabs value={filter} onValueChange={v => setFilter(v as FilterKey)}>
            <TabsList className="flex flex-wrap h-auto gap-1">
              {filterTabs.map(({ key, label, count }) => (
                <TabsTrigger key={key} value={key} className="text-sm">
                  {label} ({count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <SkeletonLoading type="table-row" count={8} />
          </CardContent>
        </Card>
      ) : filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="text-6xl text-muted-foreground mb-4 mx-auto" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Chưa có tin nhắn</h3>
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'Chưa có tin nhắn nào từ khách hàng.'
                : `Chưa có tin nhắn nào với trạng thái "${contactStatusConfig[filter as ContactMessage['status']]?.label ?? filter}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filteredMessages.map(message => {
              const status = contactStatusConfig[message.status];
              return (
                <Card
                  key={message.id}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    selectedMessage?.id === message.id && 'ring-2 ring-ring'
                  )}
                  onClick={() => handleMessageClick(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {message.status === 'new' ? (
                          <Mail className="text-lg text-primary" aria-hidden="true" />
                        ) : (
                          <MailOpen className="text-lg text-muted-foreground" aria-hidden="true" />
                        )}
                        <h3 className="font-semibold text-foreground">{message.name}</h3>
                      </div>
                      <StatusBadge label={status.label} variant={status.variant} />
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" aria-hidden="true" />
                        <span>{message.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" aria-hidden="true" />
                        <span>{message.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-6">
            {selectedMessage ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Chi tiết tin nhắn</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.status)}
                        title={
                          selectedMessage.status === 'new' ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc'
                        }
                      >
                        {selectedMessage.status === 'new' ? (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startReply(selectedMessage)}
                        title="Trả lời tin nhắn"
                      >
                        <Reply className="w-4 h-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMessage(selectedMessage.id)}
                        title="Xóa tin nhắn"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Trạng thái</Label>
                      <div className="mt-1">
                        <StatusBadge
                          label={contactStatusConfig[selectedMessage.status].label}
                          variant={contactStatusConfig[selectedMessage.status].variant}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Họ tên</Label>
                      <p className="mt-1 text-foreground">{selectedMessage.name}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="mt-1 text-foreground">
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-primary hover:underline"
                        >
                          {selectedMessage.email}
                        </a>
                      </p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Số điện thoại</Label>
                      <p className="mt-1 text-foreground">
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="text-primary hover:underline"
                        >
                          {selectedMessage.phone}
                        </a>
                      </p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Thời gian gửi</Label>
                      <p className="mt-1 text-foreground">
                        {formatDate(selectedMessage.createdAt)}
                      </p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Tin nhắn</Label>
                      <div className="mt-1 p-3 bg-muted rounded-lg">
                        <p className="text-foreground whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>

                    {selectedMessage.userAgent && (
                      <div>
                        <Label className="text-muted-foreground">Thông tin trình duyệt</Label>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {selectedMessage.userAgent}
                        </p>
                      </div>
                    )}
                  </div>

                  {isReplying && (
                    <div className="mt-6 p-4 bg-muted rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <Reply className="w-4 h-4" aria-hidden="true" />
                          Trả lời tin nhắn
                        </h4>
                        <Button variant="ghost" size="icon" onClick={cancelReply} title="Hủy">
                          <X className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reply-subject">Tiêu đề</Label>
                          <Input
                            id="reply-subject"
                            value={replySubject}
                            onChange={e => setReplySubject(e.target.value)}
                            placeholder="Tiêu đề email..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reply-message">Nội dung phản hồi</Label>
                          <Textarea
                            id="reply-message"
                            value={replyMessage}
                            onChange={e => setReplyMessage(e.target.value)}
                            rows={6}
                            placeholder="Nhập nội dung phản hồi..."
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={sendReply}
                            disabled={sendingReply || !replyMessage.trim()}
                          >
                            {sendingReply ? (
                              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Send className="w-4 h-4" aria-hidden="true" />
                            )}
                            {sendingReply ? 'Đang gửi...' : 'Gửi phản hồi'}
                          </Button>
                          <Button variant="secondary" onClick={cancelReply}>
                            Hủy
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail
                    className="text-4xl text-muted-foreground mb-4 mx-auto"
                    aria-hidden="true"
                  />
                  <p className="text-muted-foreground">Chọn một tin nhắn để xem chi tiết</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesScreen;
