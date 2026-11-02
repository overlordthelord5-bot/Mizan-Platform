import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import { BookingStatus } from '../../types';
import {
  X,
  Send,
  Paperclip,
  FileText,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Play,
  Star,
  Download,
  AlertTriangle,
  UploadCloud,
  FileSpreadsheet,
  File,
} from 'lucide-react';

interface ConsultationRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

export const ConsultationRoomModal: React.FC<ConsultationRoomModalProps> = ({
  isOpen,
  onClose,
  bookingId,
}) => {
  const {
    role,
    language,
    currentUser,
    bookings,
    services,
    profiles,
    conversations,
    messages,
    documents,
    sendMessage,
    uploadDocument,
    updateBookingStatus,
    acceptBooking,
    completeBooking,
    submitReview,
    openDispute,
  } = useStore();

  const t = translations[language];

  const booking = bookings.find((b) => b.id === bookingId);
  const service = booking ? services.find((s) => s.id === booking.service_id) : null;
  const customer = booking ? profiles.find((p) => p.id === booking.customer_id) : null;
  const accountant = booking ? profiles.find((p) => p.id === booking.accountant_id) : null;

  const conversation = conversations.find((c) => c.booking_id === bookingId);
  const roomMessages = conversation
    ? messages.filter((m) => m.conversation_id === conversation.id)
    : [];
  const roomDocuments = documents.filter((d) => d.booking_id === bookingId);

  // Component local states
  const [activeTab, setActiveTab] = useState<'chat' | 'docs' | 'notes'>('chat');
  const [inputText, setInputText] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDetails, setDisputeDetails] = useState('');

  // File upload state
  const [uploadNotes, setUploadNotes] = useState('');

  if (!isOpen || !booking || !service) return null;

  const isAccountant = currentUser.id === booking.accountant_id || role === 'accountant';
  const isCustomer = currentUser.id === booking.customer_id || role === 'customer';

  const statusColors: Record<BookingStatus, string> = {
    requested: 'bg-slate-100 text-slate-700 border-slate-200',
    awaiting_payment: 'bg-amber-50 text-amber-800 border-amber-200',
    paid: 'bg-blue-50 text-blue-700 border-blue-200',
    accepted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    in_progress: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    disputed: 'bg-red-50 text-red-700 border-red-200',
    refunded: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversation) return;
    sendMessage(conversation.id, inputText.trim());
    setInputText('');
  };

  const handleSimulateFileUpload = (type: 'pdf' | 'excel') => {
    const fileName =
      type === 'pdf'
        ? `مستند_ضريبي_${Date.now().toString().slice(-4)}.pdf`
        : `بيانات_حسابات_${Date.now().toString().slice(-4)}.xlsx`;

    uploadDocument(booking.id, {
      name: fileName,
      type: type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      sizeKb: Math.floor(100 + Math.random() * 800),
      url: '#',
      notes: uploadNotes || (language === 'ar' ? 'مرفق للاستشارة المحاسبية' : 'Consultation attachment'),
    });
    setUploadNotes('');
    setActiveTab('docs');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(booking.id, reviewRating, reviewComment);
    setShowReviewModal(false);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openDispute(booking.id, disputeReason, disputeDetails);
    setShowDisputeModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#142B43] text-[#D6AE57] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#142B43]">
                  {language === 'ar' ? service.name_ar : service.name_en}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[booking.status]}`}
                >
                  {t.statuses[booking.status]}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                رقم الحجز: <span className="font-mono">{booking.booking_number}</span> | العميل: {customer?.full_name} | المحاسب: {accountant?.full_name}
              </p>
            </div>
          </div>

          {/* Workflow Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Accountant Accept Button */}
            {isAccountant && booking.status === 'paid' && (
              <button
                type="button"
                onClick={() => acceptBooking(booking.id)}
                className="px-3 py-1.5 rounded-xl bg-[#239B76] text-white text-xs font-bold hover:bg-[#1e8565] transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>قبول الطلب</span>
              </button>
            )}

            {/* Start In-Progress */}
            {booking.status === 'accepted' && (
              <button
                type="button"
                onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                className="px-3 py-1.5 rounded-xl bg-[#142B43] text-white text-xs font-bold hover:bg-[#1C3552] transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#D6AE57]" />
                <span>بدء الاستشارة الآن</span>
              </button>
            )}

            {/* Complete Consultation */}
            {booking.status === 'in_progress' && (
              <button
                type="button"
                onClick={() => completeBooking(booking.id)}
                className="px-3 py-1.5 rounded-xl bg-[#239B76] text-white text-xs font-bold hover:bg-[#1e8565] transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تأكيد اكتمال الاستشارة</span>
              </button>
            )}

            {/* Customer Review Button */}
            {isCustomer && booking.status === 'completed' && (
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>تقييم المحاسب</span>
              </button>
            )}

            {/* Open Dispute Button */}
            {['accepted', 'in_progress', 'completed'].includes(booking.status) && (
              <button
                type="button"
                onClick={() => setShowDisputeModal(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="فتح شكوى أو نزاع"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}

            {/* Close modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Room Tabs */}
        <div className="px-6 border-b border-slate-200 flex gap-6 text-xs font-bold text-slate-500">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'chat'
                ? 'border-[#142B43] text-[#142B43]'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            {language === 'ar' ? 'المحادثة الحية' : 'Live Chat'} ({roomMessages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'docs'
                ? 'border-[#142B43] text-[#142B43]'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            {language === 'ar' ? 'المستندات المالية المشتركة' : 'Document Vault'} ({roomDocuments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'notes'
                ? 'border-[#142B43] text-[#142B43]'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            {language === 'ar' ? 'تفاصيل الحجز والرسوم' : 'Session & Fee Details'}
          </button>
        </div>

        {/* Tab 1: Live Chat */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F7FA]">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {roomMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  لا توجد رسائل بعد. ابدأ التواصل مع المحاسب لمناقشة استشارتك.
                </div>
              ) : (
                roomMessages.map((msg) => {
                  const isMe = msg.sender_id === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-700">{msg.sender_name}</span>
                        <span>•</span>
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-[#142B43] text-white rounded-te-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-ts-none'
                        }`}
                      >
                        <p>{msg.content}</p>

                        {msg.attachment_name && (
                          <div
                            className={`mt-2 p-2 rounded-xl flex items-center gap-2 text-xs border ${
                              isMe
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <FileText className="w-4 h-4 text-[#D6AE57]" />
                            <span className="truncate flex-1 font-medium">{msg.attachment_name}</span>
                            <Download className="w-3.5 h-3.5 shrink-0" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Footer */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'اكتب رسالتك للمحاسب هنا...'
                    : 'Type message to accountant...'
                }
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs focus:border-[#D6AE57] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSimulateFileUpload('pdf')}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
                title="إرفاق مستند PDF"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#142B43] text-white hover:bg-[#1C3552] transition disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Document Vault */}
        {activeTab === 'docs' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 text-center space-y-3">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-[#142B43]">
                {language === 'ar' ? 'رفع مستند مالي أو ضريبي جديد' : 'Upload Financial or Tax Document'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                يدعم صيغ PDF, Excel (XLSX), Word (DOCX), JPG حتى 25 ميجابايت مع تشفير تام.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSimulateFileUpload('pdf')}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:border-[#D6AE57] transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>رفع إشعار ضريبي (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateFileUpload('excel')}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:border-[#D6AE57] transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>رفع كشف حسابات (Excel)</span>
                </button>
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'ar' ? 'المستندات المرفوعة لهذه الاستشارة' : 'Uploaded Files'}
              </h3>
              {roomDocuments.length === 0 ? (
                <p className="text-xs text-slate-400">لا توجد ملفات مرفوعة بعد.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roomDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs hover:border-[#D6AE57] transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          {doc.file_type.includes('pdf') ? (
                            <FileText className="w-4 h-4 text-rose-500" />
                          ) : (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#142B43] truncate">{doc.file_name}</p>
                          <p className="text-[10px] text-slate-400">
                            {doc.file_size_kb} KB • {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`محاكاة تحميل آمن للمستند: ${doc.file_name}`);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                        title="تحميل"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Session Details & Ledger Note */}
        {activeTab === 'notes' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <h3 className="font-bold text-sm text-[#142B43]">معلومات الاستشارة</h3>
              <div className="grid grid-cols-2 gap-3 text-slate-600">
                <div>
                  <span className="text-slate-400 block">الموعد المحدد:</span>
                  <span className="font-semibold text-[#142B43]">
                    {new Date(booking.scheduled_at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">المدة:</span>
                  <span className="font-semibold text-[#142B43]">{booking.duration_minutes} دقيقة</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block mb-1">ملاحظات واستفسار العميل:</span>
                <p className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {booking.notes || 'لا توجد ملاحظات إضافية مسجلة.'}
                </p>
              </div>
            </div>

            {/* Financial Ledger Record */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
              <h3 className="font-bold text-sm text-[#142B43]">المعالجة المحاسبية للحجز (EGP)</h3>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>إجمالي المبلغ المسدد:</span>
                <span className="font-bold">{formatEGP(booking.total_amount_piasters, language)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-500">
                <span>عمولة المنصة ({Math.round(booking.commission_rate * 100)}%):</span>
                <span>{formatEGP(booking.platform_fee_piasters, language)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-emerald-700">
                <span>مستحق المحاسب بعد الاستشارة (85%):</span>
                <span>{formatEGP(booking.accountant_payout_piasters, language)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60">
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#142B43]">تقييم استشارة المحاسب</h3>
              <button type="button" onClick={() => setShowReviewModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">التقييم العام</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setReviewRating(num)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        num <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">تعليقك ورأيك</label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="اكتب تجربتك مع المحاسب لمساعدة الآخرين..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#142B43] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              إرسال التقييم
            </button>
          </form>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60">
          <form
            onSubmit={handleDisputeSubmit}
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-[#142B43]">فتح نزاع أو شكوى رسمية</h3>
              </div>
              <button type="button" onClick={() => setShowDisputeModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">سبب النزاع</label>
              <input
                type="text"
                required
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="مثلاً: عدم حضور المحاسب في الموعد"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">التفاصيل والأدلة</label>
              <textarea
                rows={3}
                required
                value={disputeDetails}
                onChange={(e) => setDisputeDetails(e.target.value)}
                placeholder="اشرح ما حدث بدقة لتقوم الإدارة بالتحقيق..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#DC5656] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              إرسال النزاع للإدارة
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
