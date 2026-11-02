/**
 * Global Reactive Store & State Engine for MEEZAN Platform
 * Provides persistent state management with localStorage, reactive notifications,
 * full transaction ledger generation, booking workflow, and role switching.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Profile,
  AccountantProfile,
  AccountantApplication,
  ServiceCategory,
  Service,
  AvailabilitySlot,
  Booking,
  BookingStatus,
  Payment,
  Payout,
  LedgerAccount,
  LedgerTransaction,
  LedgerEntry,
  Conversation,
  Message,
  DocumentItem,
  Review,
  Dispute,
  NotificationItem,
  PlatformSettings,
  AuditLog,
} from '../types';
import {
  SEED_PROFILES,
  SEED_ACCOUNTANT_PROFILES,
  SEED_ACCOUNTANT_APPLICATIONS,
  SEED_CATEGORIES,
  SEED_SERVICES,
  SEED_SLOTS,
  SEED_BOOKINGS,
  SEED_PAYMENTS,
  SEED_PAYOUTS,
  SEED_LEDGER_TRANSACTIONS,
  SEED_LEDGER_ENTRIES,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_DOCUMENTS,
  SEED_REVIEWS,
  SEED_DISPUTES,
  SEED_NOTIFICATIONS,
  SEED_SETTINGS,
  SEED_AUDIT_LOGS,
} from './mockData';
import {
  INITIAL_CHART_OF_ACCOUNTS,
  calculateBookingSplit,
  createBookingPaymentEntries,
  createPayoutSettlementEntries,
  createReversalEntries,
} from './accounting';
import { canTransitionStatus, isSlotAvailable } from './bookingStateMachine';

interface StoreContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: Profile;
  setCurrentUser: (user: Profile) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  
  // Data State
  profiles: Profile[];
  accountantProfiles: AccountantProfile[];
  accountantApplications: AccountantApplication[];
  categories: ServiceCategory[];
  services: Service[];
  slots: AvailabilitySlot[];
  bookings: Booking[];
  payments: Payment[];
  payouts: Payout[];
  ledgerAccounts: LedgerAccount[];
  ledgerTransactions: LedgerTransaction[];
  ledgerEntries: LedgerEntry[];
  conversations: Conversation[];
  messages: Message[];
  documents: DocumentItem[];
  reviews: Review[];
  disputes: Dispute[];
  notifications: NotificationItem[];
  favorites: string[];
  platformSettings: PlatformSettings;
  auditLogs: AuditLog[];

  // Actions
  createBooking: (
    accountantId: string,
    serviceId: string,
    slotId: string,
    notes?: string
  ) => { success: boolean; bookingId?: string; error?: string };

  processSandboxPayment: (
    bookingId: string,
    method: 'card' | 'fawry' | 'wallet',
    simulateSuccess: boolean
  ) => { success: boolean; error?: string };

  updateBookingStatus: (bookingId: string, newStatus: BookingStatus) => boolean;
  acceptBooking: (bookingId: string) => boolean;
  completeBooking: (bookingId: string) => boolean;
  
  sendMessage: (
    conversationId: string,
    content: string,
    attachment?: { name: string; url: string; type: string }
  ) => void;

  uploadDocument: (
    bookingId: string,
    file: { name: string; type: string; sizeKb: number; url: string; notes?: string }
  ) => void;

  submitReview: (bookingId: string, rating: number, comment: string) => boolean;
  openDispute: (bookingId: string, reason: string, details: string) => boolean;
  resolveDispute: (disputeId: string, decision: string, outcome: 'refund' | 'release' | 'dismiss') => boolean;

  approveAccountantApplication: (applicationId: string) => boolean;
  rejectAccountantApplication: (applicationId: string, reason: string) => boolean;
  togglePublishAccountant: (accountantProfileId: string) => boolean;

  updatePlatformCommissionRate: (rate: number) => void;
  requestPayout: (amountPiasters: number, bankName: string, iban: string) => boolean;
  processPayoutPayment: (payoutId: string) => boolean;

  reverseTransaction: (txId: string, reason: string) => boolean;
  addAvailabilitySlot: (startTime: string, endTime: string) => boolean;
  deleteAvailabilitySlot: (slotId: string) => boolean;
  toggleFavorite: (accountantId: string) => void;

  markNotificationsRead: () => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY = 'MEEZAN_MARKETPLACE_STORE_V1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>('ar');
  const [role, setRoleState] = useState<UserRole>('customer');

  // Load from local storage or defaults
  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      profiles: SEED_PROFILES,
      accountantProfiles: SEED_ACCOUNTANT_PROFILES,
      accountantApplications: SEED_ACCOUNTANT_APPLICATIONS,
      categories: SEED_CATEGORIES,
      services: SEED_SERVICES,
      slots: SEED_SLOTS,
      bookings: SEED_BOOKINGS,
      payments: SEED_PAYMENTS,
      payouts: SEED_PAYOUTS,
      ledgerAccounts: INITIAL_CHART_OF_ACCOUNTS,
      ledgerTransactions: SEED_LEDGER_TRANSACTIONS,
      ledgerEntries: SEED_LEDGER_ENTRIES,
      conversations: SEED_CONVERSATIONS,
      messages: SEED_MESSAGES,
      documents: SEED_DOCUMENTS,
      reviews: SEED_REVIEWS,
      disputes: SEED_DISPUTES,
      notifications: SEED_NOTIFICATIONS,
      favorites: ['user-acc-1'],
      platformSettings: SEED_SETTINGS,
      auditLogs: SEED_AUDIT_LOGS,
    };
  };

  const initial = loadInitialData();

  const [profiles, setProfiles] = useState<Profile[]>(initial.profiles);
  const [accountantProfiles, setAccountantProfiles] = useState<AccountantProfile[]>(initial.accountantProfiles);
  const [accountantApplications, setAccountantApplications] = useState<AccountantApplication[]>(initial.accountantApplications);
  const [categories, setCategories] = useState<ServiceCategory[]>(initial.categories);
  const [services, setServices] = useState<Service[]>(initial.services);
  const [slots, setSlots] = useState<AvailabilitySlot[]>(initial.slots);
  const [bookings, setBookings] = useState<Booking[]>(initial.bookings);
  const [payments, setPayments] = useState<Payment[]>(initial.payments);
  const [payouts, setPayouts] = useState<Payout[]>(initial.payouts);
  const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>(initial.ledgerAccounts);
  const [ledgerTransactions, setLedgerTransactions] = useState<LedgerTransaction[]>(initial.ledgerTransactions);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(initial.ledgerEntries);
  const [conversations, setConversations] = useState<Conversation[]>(initial.conversations);
  const [messages, setMessages] = useState<Message[]>(initial.messages);
  const [documents, setDocuments] = useState<DocumentItem[]>(initial.documents);
  const [reviews, setReviews] = useState<Review[]>(initial.reviews);
  const [disputes, setDisputes] = useState<Dispute[]>(initial.disputes);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initial.notifications);
  const [favorites, setFavorites] = useState<string[]>(initial.favorites);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(initial.platformSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initial.auditLogs);

  // Derive current user based on active role
  const currentUser =
    profiles.find((p) => p.role === role) ||
    (role === 'customer'
      ? profiles.find((p) => p.id === 'user-cust-1')!
      : role === 'accountant'
      ? profiles.find((p) => p.id === 'user-acc-1')!
      : profiles.find((p) => p.id === 'user-admin-1')!);

  // Persist to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        profiles,
        accountantProfiles,
        accountantApplications,
        categories,
        services,
        slots,
        bookings,
        payments,
        payouts,
        ledgerAccounts,
        ledgerTransactions,
        ledgerEntries,
        conversations,
        messages,
        documents,
        reviews,
        disputes,
        notifications,
        favorites,
        platformSettings,
        auditLogs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // ignore
    }
  }, [
    profiles,
    accountantProfiles,
    accountantApplications,
    categories,
    services,
    slots,
    bookings,
    payments,
    payouts,
    ledgerAccounts,
    ledgerTransactions,
    ledgerEntries,
    conversations,
    messages,
    documents,
    reviews,
    disputes,
    notifications,
    favorites,
    platformSettings,
    auditLogs,
  ]);

  // Sync document language and dir attribute
  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const addNotification = (
    userId: string,
    title_ar: string,
    title_en: string,
    message_ar: string,
    message_en: string,
    type: NotificationItem['type'] = 'system',
    link?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      title_ar,
      title_en,
      message_ar,
      message_en,
      type,
      is_read: false,
      link,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const logAudit = (action: string, targetEntity: string, targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actor_id: currentUser.id,
      actor_name: `${currentUser.full_name} (${role})`,
      action,
      target_entity: targetEntity,
      target_id: targetId,
      details,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // 1. Create Booking
  const createBooking = (
    accountantId: string,
    serviceId: string,
    slotId: string,
    notes?: string
  ) => {
    const targetService = services.find((s) => s.id === serviceId);
    if (!targetService) return { success: false, error: 'الخدمة غير متوفرة' };

    // Prevent slot collision
    const existingBookedSlotIds = bookings
      .filter((b) => b.status !== 'cancelled' && b.status !== 'refunded')
      .map((b) => b.slot_id);

    if (!isSlotAvailable(slotId, slots, existingBookedSlotIds)) {
      return { success: false, error: 'الموعد المختار محجوز مسبقاً أو يتعارض مع موعد آخر' };
    }

    const currentCommissionRate = platformSettings.commission_rate; // Locked at creation
    const { platformFeePiasters, accountantPayoutPiasters } = calculateBookingSplit(
      targetService.price_piasters,
      currentCommissionRate
    );

    const bookingId = `bk-${Date.now().toString().slice(-6)}`;
    const bookingNumber = `MZN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const targetSlot = slots.find((s) => s.id === slotId);

    const newBooking: Booking = {
      id: bookingId,
      booking_number: bookingNumber,
      customer_id: currentUser.id,
      accountant_id: accountantId,
      service_id: serviceId,
      slot_id: slotId,
      scheduled_at: targetSlot ? targetSlot.start_time : new Date().toISOString(),
      duration_minutes: targetService.duration_minutes,
      notes: notes || '',
      status: 'awaiting_payment',
      total_amount_piasters: targetService.price_piasters,
      commission_rate: currentCommissionRate,
      platform_fee_piasters: platformFeePiasters,
      accountant_payout_piasters: accountantPayoutPiasters,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Mark slot as booked
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, is_booked: true, booking_id: bookingId } : s))
    );

    setBookings((prev) => [newBooking, ...prev]);

    // Create conversation room for booking
    const newConv: Conversation = {
      id: `conv-${bookingId}`,
      booking_id: bookingId,
      customer_id: currentUser.id,
      accountant_id: accountantId,
      created_at: new Date().toISOString(),
    };
    setConversations((prev) => [...prev, newConv]);

    addNotification(
      accountantId,
      'طلب حجز جديد',
      'New Booking Request',
      `قام العميل ${currentUser.full_name} بإنشاء حجز لخدمة: ${targetService.name_ar}`,
      `Client ${currentUser.full_name} created a booking for ${targetService.name_en}`,
      'booking',
      'requests'
    );

    logAudit('إنشاء حجز', 'bookings', bookingId, `حجز جديد برقم ${bookingNumber} بقيمة ${targetService.price_piasters / 100} ج.م`);

    return { success: true, bookingId };
  };

  // 2. Process Sandbox Payment
  const processSandboxPayment = (
    bookingId: string,
    method: 'card' | 'fawry' | 'wallet',
    simulateSuccess: boolean
  ) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'الحجز غير موجود' };

    const paymentId = `pay-${Date.now()}`;
    const txnId = `SBX-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const idempotencyKey = `idem-${bookingId}-${Date.now()}`;

    if (!simulateSuccess) {
      const failedPayment: Payment = {
        id: paymentId,
        booking_id: bookingId,
        customer_id: booking.customer_id,
        amount_piasters: booking.total_amount_piasters,
        currency: 'EGP',
        provider: 'Meezan_Sandbox_Pay',
        transaction_id: txnId,
        status: 'failed',
        payment_method: method,
        idempotency_key: idempotencyKey,
        failure_reason: 'تم رفض العملية في بيئة الاختبار (Simulated Card Declined)',
        created_at: new Date().toISOString(),
      };
      setPayments((prev) => [failedPayment, ...prev]);
      return { success: false, error: 'فشلت عملية الدفع التجريبية - تم محاكاة رفض البطاقة' };
    }

    // Success flow
    const successPayment: Payment = {
      id: paymentId,
      booking_id: bookingId,
      customer_id: booking.customer_id,
      amount_piasters: booking.total_amount_piasters,
      currency: 'EGP',
      provider: 'Meezan_Sandbox_Pay',
      transaction_id: txnId,
      status: 'success',
      payment_method: method,
      idempotency_key: idempotencyKey,
      created_at: new Date().toISOString(),
    };

    setPayments((prev) => [successPayment, ...prev]);

    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'paid', updated_at: new Date().toISOString() }
          : b
      )
    );

    // Create balanced double-entry ledger transactions
    const { transaction, entries } = createBookingPaymentEntries(
      `tx-${paymentId}`,
      booking.total_amount_piasters,
      booking.commission_rate
    );

    setLedgerTransactions((prev) => [transaction, ...prev]);
    setLedgerEntries((prev) => [...prev, ...entries]);

    // Update Ledger Account balances
    setLedgerAccounts((prev) =>
      prev.map((acc) => {
        if (acc.account_number === 1000) {
          return { ...acc, balance_piasters: acc.balance_piasters + booking.total_amount_piasters };
        }
        if (acc.account_number === 2000) {
          return { ...acc, balance_piasters: acc.balance_piasters + booking.accountant_payout_piasters };
        }
        if (acc.account_number === 4000) {
          return { ...acc, balance_piasters: acc.balance_piasters + booking.platform_fee_piasters };
        }
        return acc;
      })
    );

    addNotification(
      booking.customer_id,
      'تم الدفع بنجاح',
      'Payment Successful',
      `تم تأكيد دفع مبلغ ${booking.total_amount_piasters / 100} ج.م لحجزك رقم ${booking.booking_number}`,
      `Payment of ${booking.total_amount_piasters / 100} EGP confirmed for booking ${booking.booking_number}`,
      'payment',
      'bookings'
    );

    addNotification(
      booking.accountant_id,
      'تم سداد قيمة الاستشارة',
      'Consultation Paid',
      `تم سداد قيمة الحجز ${booking.booking_number}، يمكنك الآن قبول الطلب وبدء الاستشارة`,
      `Booking ${booking.booking_number} has been paid. Ready to accept.`,
      'payment',
      'requests'
    );

    logAudit(
      'تسجيل عملية دفع',
      'payments',
      paymentId,
      `دفع تجريبي ناجح لمبلغ ${booking.total_amount_piasters / 100} ج.م مع قيد محاسبي متوازن`
    );

    return { success: true };
  };

  // 3. Update Booking Status with State Machine Check
  const updateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    if (!canTransitionStatus(booking.status, newStatus)) {
      return false;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: newStatus, updated_at: new Date().toISOString() } : b
      )
    );

    logAudit('تحديث حالة حجز', 'bookings', bookingId, `تغيير الحالة من ${booking.status} إلى ${newStatus}`);
    return true;
  };

  const acceptBooking = (bookingId: string) => {
    const ok = updateBookingStatus(bookingId, 'accepted');
    if (ok) {
      const b = bookings.find((x) => x.id === bookingId);
      if (b) {
        addNotification(
          b.customer_id,
          'تم قبول الاستشارة',
          'Consultation Accepted',
          `قبل المحاسب استشارتك رقم ${b.booking_number}. تفضل بزيارة غرفة المحادثة`,
          `Accountant accepted booking ${b.booking_number}. Visit chat room.`,
          'booking',
          'chat'
        );
      }
    }
    return ok;
  };

  const completeBooking = (bookingId: string) => {
    const ok = updateBookingStatus(bookingId, 'completed');
    if (ok) {
      const b = bookings.find((x) => x.id === bookingId);
      if (b) {
        addNotification(
          b.customer_id,
          'اكتملت الاستشارة',
          'Consultation Completed',
          `اكتملت استشارتك بنجاح. يرجى تقييم أداء المحاسب لمساعدة الآخرين`,
          `Consultation completed. Please rate your accountant.`,
          'booking',
          'reviews'
        );
      }
    }
    return ok;
  };

  // 4. Send Message & Upload Document
  const sendMessage = (
    conversationId: string,
    content: string,
    attachment?: { name: string; url: string; type: string }
  ) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      content,
      attachment_name: attachment?.name,
      attachment_url: attachment?.url,
      attachment_type: attachment?.type,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const uploadDocument = (
    bookingId: string,
    file: { name: string; type: string; sizeKb: number; url: string; notes?: string }
  ) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      booking_id: bookingId,
      uploaded_by: currentUser.id,
      file_name: file.name,
      file_type: file.type,
      file_size_kb: file.sizeKb,
      file_url: file.url,
      notes: file.notes,
      created_at: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);

    logAudit('رفع مستند مالي', 'documents', newDoc.id, `تم رفع ${file.name} بحجم ${file.sizeKb}KB`);
  };

  // 5. Reviews
  const submitReview = (bookingId: string, rating: number, comment: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      booking_id: bookingId,
      accountant_id: booking.accountant_id,
      customer_id: booking.customer_id,
      customer_name: currentUser.full_name,
      rating,
      comment,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate accountant rating
    setAccountantProfiles((prev) =>
      prev.map((acc) => {
        if (acc.profile_id === booking.accountant_id) {
          const accReviews = [...reviews.filter((r) => r.accountant_id === acc.profile_id), newReview];
          const avg = accReviews.reduce((sum, r) => sum + r.rating, 0) / accReviews.length;
          return {
            ...acc,
            rating: Number(avg.toFixed(2)),
            reviews_count: accReviews.length,
          };
        }
        return acc;
      })
    );

    addNotification(
      booking.accountant_id,
      'تقييم جديد من العميل',
      'New Client Review',
      `حصلت على تقييم ${rating} نجوم من ${currentUser.full_name}`,
      `Received ${rating}-star review from ${currentUser.full_name}`,
      'system',
      'reviews'
    );

    return true;
  };

  // 6. Disputes
  const openDispute = (bookingId: string, reason: string, details: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      booking_id: bookingId,
      opened_by_id: currentUser.id,
      opened_by_role: role === 'accountant' ? 'accountant' : 'customer',
      reason,
      details,
      status: 'open',
      created_at: new Date().toISOString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);
    updateBookingStatus(bookingId, 'disputed');

    addNotification(
      'user-admin-1',
      'فتح نزاع جديد',
      'New Dispute Opened',
      `تم فتح نزاع للحجز رقم ${booking.booking_number} - السبب: ${reason}`,
      `Dispute opened for booking ${booking.booking_number}`,
      'dispute',
      'disputes'
    );

    logAudit('فتح نزاع', 'disputes', newDispute.id, `فتح نزاع للحجز ${booking.booking_number}`);
    return true;
  };

  const resolveDispute = (
    disputeId: string,
    decision: string,
    outcome: 'refund' | 'release' | 'dismiss'
  ) => {
    const dispute = disputes.find((d) => d.id === disputeId);
    if (!dispute) return false;

    const booking = bookings.find((b) => b.id === dispute.booking_id);
    if (!booking) return false;

    let targetStatus: BookingStatus = 'completed';
    let disputeStatus: Dispute['status'] = 'resolved_released';

    if (outcome === 'refund') {
      targetStatus = 'refunded';
      disputeStatus = 'resolved_refunded';

      // Find original transaction and make reversal entry
      const originalTx = ledgerTransactions.find(
        (t) => t.reference_type === 'booking_payment' && t.description.includes(booking.booking_number)
      );
      if (originalTx) {
        const origEntries = ledgerEntries.filter((e) => e.transaction_id === originalTx.id);
        const { reversalTransaction, reversalEntries } = createReversalEntries(
          originalTx,
          origEntries,
          `tx-rev-${Date.now()}`,
          `تسوية نزاع بالاسترداد للعميل - ${decision}`
        );
        setLedgerTransactions((prev) => [reversalTransaction, ...prev]);
        setLedgerEntries((prev) => [...prev, ...reversalEntries]);
      }
    } else if (outcome === 'dismiss') {
      disputeStatus = 'dismissed';
      targetStatus = 'in_progress';
    }

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: disputeStatus,
              admin_decision: decision,
              resolved_at: new Date().toISOString(),
            }
          : d
      )
    );

    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: targetStatus } : b))
    );

    logAudit(
      'تسوية نزاع',
      'disputes',
      disputeId,
      `قرار الإدارة: ${decision} - النتيجة: ${outcome}`
    );

    return true;
  };

  // 7. Accountant Accreditation Pipeline
  const approveAccountantApplication = (applicationId: string) => {
    const app = accountantApplications.find((a) => a.id === applicationId);
    if (!app) return false;

    setAccountantApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: 'approved',
              reviewed_by: currentUser.id,
              reviewed_at: new Date().toISOString(),
            }
          : a
      )
    );

    // Create or publish accountant profile
    const existingProfile = accountantProfiles.find((ap) => ap.profile_id === app.profile_id);
    if (existingProfile) {
      setAccountantProfiles((prev) =>
        prev.map((ap) =>
          ap.id === existingProfile.id ? { ...ap, is_verified: true, is_published: true } : ap
        )
      );
    } else {
      const newAccProfile: AccountantProfile = {
        id: `ap-${Date.now()}`,
        profile_id: app.profile_id,
        title: 'محاسب قانوني ومراجع معتمد',
        specialty: app.specialties[0] || 'الاستشارات الضريبية',
        sub_specialties: app.specialties,
        years_of_experience: app.years_of_experience,
        hourly_rate_piasters: 75000, // 750 EGP default
        bio: app.bio,
        education: app.degrees,
        certifications: app.certifications,
        license_number: app.license_number,
        is_verified: true,
        is_published: true,
        rating: 5.0,
        reviews_count: 0,
        consultation_methods: ['video', 'chat'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setAccountantProfiles((prev) => [...prev, newAccProfile]);
    }

    addNotification(
      app.profile_id,
      'تم اعتمادك كمحاسب رسمي في مِيزان',
      'Application Approved',
      'تهانينا! تمت مراجعة أوراقك واعتماد ملفك ونشره في دليل المحاسبين.',
      'Congratulations! Your accreditation application has been approved and published.',
      'system',
      'profile'
    );

    logAudit('اعتماد محاسب', 'accountant_applications', applicationId, `اعتماد أوراق ${app.full_name}`);
    return true;
  };

  const rejectAccountantApplication = (applicationId: string, reason: string) => {
    setAccountantApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: 'rejected',
              rejection_reason: reason,
              reviewed_by: currentUser.id,
              reviewed_at: new Date().toISOString(),
            }
          : a
      )
    );

    logAudit('رفض طلب اعتماد', 'accountant_applications', applicationId, `السبب: ${reason}`);
    return true;
  };

  const togglePublishAccountant = (accountantProfileId: string) => {
    setAccountantProfiles((prev) =>
      prev.map((ap) => (ap.id === accountantProfileId ? { ...ap, is_published: !ap.is_published } : ap))
    );
    return true;
  };

  // 8. Platform Settings & Commission Rate
  const updatePlatformCommissionRate = (rate: number) => {
    setPlatformSettings((prev) => ({ ...prev, commission_rate: rate }));
    logAudit(
      'تعديل نسبة العمولة',
      'platform_settings',
      '1',
      `تم تحديث نسبة العمولة إلى ${Math.round(rate * 100)}% للحجوزات الجديدة`
    );
  };

  // 9. Payouts
  const requestPayout = (amountPiasters: number, bankName: string, iban: string) => {
    const newPayout: Payout = {
      id: `payout-${Date.now()}`,
      accountant_id: currentUser.id,
      amount_piasters: amountPiasters,
      bank_name: bankName,
      iban_or_account: iban,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setPayouts((prev) => [newPayout, ...prev]);

    logAudit(
      'طلب تحويل مستحقات',
      'payouts',
      newPayout.id,
      `طلب سحب مبلغ ${amountPiasters / 100} ج.م إلى بنك ${bankName}`
    );
    return true;
  };

  const processPayoutPayment = (payoutId: string) => {
    const payout = payouts.find((p) => p.id === payoutId);
    if (!payout) return false;

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId ? { ...p, status: 'completed', processed_at: new Date().toISOString() } : p
      )
    );

    const accountantUser = profiles.find((pr) => pr.id === payout.accountant_id);
    const { transaction, entries } = createPayoutSettlementEntries(
      `tx-payout-${payoutId}`,
      payoutId,
      payout.amount_piasters,
      accountantUser?.full_name || 'محاسب معتمد'
    );

    setLedgerTransactions((prev) => [transaction, ...prev]);
    setLedgerEntries((prev) => [...prev, ...entries]);

    // Update Ledger Account balances: Dr 2000 (decrease liability), Cr 1100 (decrease bank)
    setLedgerAccounts((prev) =>
      prev.map((acc) => {
        if (acc.account_number === 2000) {
          return { ...acc, balance_piasters: acc.balance_piasters - payout.amount_piasters };
        }
        if (acc.account_number === 1100) {
          return { ...acc, balance_piasters: acc.balance_piasters - payout.amount_piasters };
        }
        return acc;
      })
    );

    addNotification(
      payout.accountant_id,
      'تم تحويل أرباحك بنجاح',
      'Payout Processed',
      `تم إرسال تحويل بنكي بمبلغ ${payout.amount_piasters / 100} ج.م إلى حسابك`,
      `Bank transfer of ${payout.amount_piasters / 100} EGP has been dispatched.`,
      'payout',
      'earnings'
    );

    logAudit('تسوية تحويل بنكي', 'payouts', payoutId, `تحويل مستحقات بمبلغ ${payout.amount_piasters / 100} ج.م`);
    return true;
  };

  // 10. Ledger Reversal
  const reverseTransaction = (txId: string, reason: string) => {
    const tx = ledgerTransactions.find((t) => t.id === txId);
    if (!tx || tx.is_reversed) return false;

    const entries = ledgerEntries.filter((e) => e.transaction_id === txId);
    const newTxId = `tx-rev-${Date.now()}`;
    const { reversalTransaction, reversalEntries } = createReversalEntries(
      tx,
      entries,
      newTxId,
      reason
    );

    setLedgerTransactions((prev) => [
      reversalTransaction,
      ...prev.map((t) => (t.id === txId ? { ...t, is_reversed: true, reversed_by_id: newTxId } : t)),
    ]);
    setLedgerEntries((prev) => [...prev, ...reversalEntries]);

    logAudit('قيد عكسي محاسبي', 'ledger_transactions', txId, `إنشاء قيد عكسي #${newTxId} - السبب: ${reason}`);
    return true;
  };

  // 11. Availability Slots Management
  const addAvailabilitySlot = (startTime: string, endTime: string) => {
    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      accountant_id: currentUser.id,
      start_time: startTime,
      end_time: endTime,
      is_booked: false,
    };
    setSlots((prev) => [...prev, newSlot]);
    return true;
  };

  const deleteAvailabilitySlot = (slotId: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
    return true;
  };

  const toggleFavorite = (accountantId: string) => {
    setFavorites((prev) =>
      prev.includes(accountantId) ? prev.filter((id) => id !== accountantId) : [...prev, accountantId]
    );
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <StoreContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser: () => {},
        language,
        setLanguage,
        profiles,
        accountantProfiles,
        accountantApplications,
        categories,
        services,
        slots,
        bookings,
        payments,
        payouts,
        ledgerAccounts,
        ledgerTransactions,
        ledgerEntries,
        conversations,
        messages,
        documents,
        reviews,
        disputes,
        notifications,
        favorites,
        platformSettings,
        auditLogs,
        createBooking,
        processSandboxPayment,
        updateBookingStatus,
        acceptBooking,
        completeBooking,
        sendMessage,
        uploadDocument,
        submitReview,
        openDispute,
        resolveDispute,
        approveAccountantApplication,
        rejectAccountantApplication,
        togglePublishAccountant,
        updatePlatformCommissionRate,
        requestPayout,
        processPayoutPayment,
        reverseTransaction,
        addAvailabilitySlot,
        deleteAvailabilitySlot,
        toggleFavorite,
        markNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
