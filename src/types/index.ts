/**
 * MEEZAN | مِيزان - B2C Accounting Consultation Marketplace
 * Comprehensive Type Definitions mirroring the 22 Supabase Database Tables
 */

export type UserRole = 'customer' | 'accountant' | 'admin';

export type BookingStatus =
  | 'requested'
  | 'awaiting_payment'
  | 'paid'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'refunded';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_info';

export type DisputeStatus = 'open' | 'under_investigation' | 'resolved_refunded' | 'resolved_released' | 'dismissed';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type ConsultationType = 'video' | 'chat' | 'in_person';

// 1. profiles
export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  city: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 2. accountant_applications
export interface AccountantApplication {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  phone: string;
  license_number: string;
  tax_card_number?: string;
  years_of_experience: number;
  specialties: string[];
  bio: string;
  degrees: string;
  certifications: string[]; // e.g. "محاسب قانوني معتمد - جمعية المحاسبين والمراجعين المصرية"
  documents_urls: { name: string; url: string; type: string }[];
  status: ApplicationStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

// 3. accountant_profiles
export interface AccountantProfile {
  id: string;
  profile_id: string;
  title: string;
  specialty: string;
  sub_specialties: string[];
  years_of_experience: number;
  hourly_rate_piasters: number; // in piasters (e.g. 50000 = 500.00 EGP)
  bio: string;
  education: string;
  certifications: string[];
  license_number: string;
  is_verified: boolean;
  is_published: boolean;
  rating: number;
  reviews_count: number;
  consultation_methods: ConsultationType[];
  created_at: string;
  updated_at: string;
}

// 4. service_categories
export interface ServiceCategory {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

// 5. services
export interface Service {
  id: string;
  category_id: string;
  accountant_id?: string; // If null, platform standard service template
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price_piasters: number; // in piasters
  duration_minutes: number;
  consultation_type: ConsultationType;
  is_active: boolean;
}

// 6. availability_slots
export interface AvailabilitySlot {
  id: string;
  accountant_id: string;
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
  is_booked: boolean;
  booking_id?: string;
}

// 7. bookings
export interface Booking {
  id: string;
  booking_number: string; // e.g. MZN-2026-1042
  customer_id: string;
  accountant_id: string;
  service_id: string;
  slot_id: string;
  scheduled_at: string;
  duration_minutes: number;
  notes?: string;
  status: BookingStatus;
  
  // Financial amounts in piasters (1 EGP = 100 piasters)
  total_amount_piasters: number;
  commission_rate: number; // e.g. 0.15 (15%) locked at creation time
  platform_fee_piasters: number;
  accountant_payout_piasters: number;
  
  created_at: string;
  updated_at: string;
}

// 8. payments
export interface Payment {
  id: string;
  booking_id: string;
  customer_id: string;
  amount_piasters: number;
  currency: 'EGP';
  provider: 'Meezan_Sandbox_Pay';
  transaction_id: string;
  status: PaymentStatus;
  payment_method: 'card' | 'fawry' | 'wallet';
  idempotency_key: string;
  failure_reason?: string;
  created_at: string;
}

// 9. payment_webhook_events
export interface PaymentWebhookEvent {
  id: string;
  event_id: string;
  provider: string;
  event_type: string;
  payload: Record<string, unknown>;
  is_processed: boolean;
  created_at: string;
}

// 10. payouts
export interface Payout {
  id: string;
  accountant_id: string;
  amount_piasters: number;
  bank_name: string;
  iban_or_account: string;
  status: PayoutStatus;
  processed_at?: string;
  created_at: string;
}

// 11. ledger_accounts
export interface LedgerAccount {
  account_number: number; // 1000, 1100, 2000, 2100, 4000, 5000, 5100
  name_ar: string;
  name_en: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance_piasters: number;
}

// 12. ledger_transactions
export interface LedgerTransaction {
  id: string;
  reference_type: 'booking_payment' | 'payout_settlement' | 'refund' | 'adjustment';
  reference_id: string;
  description: string;
  posted_at: string;
  is_reversed: boolean;
  reversed_by_id?: string;
}

// 13. ledger_entries
export interface LedgerEntry {
  id: string;
  transaction_id: string;
  account_number: number;
  entry_type: 'debit' | 'credit';
  amount_piasters: number;
}

// 14. conversations
export interface Conversation {
  id: string;
  booking_id: string;
  customer_id: string;
  accountant_id: string;
  created_at: string;
}

// 15. messages
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_type?: string;
  is_read: boolean;
  created_at: string;
}

// 16. documents
export interface DocumentItem {
  id: string;
  booking_id: string;
  uploaded_by: string;
  file_name: string;
  file_type: string;
  file_size_kb: number;
  file_url: string;
  notes?: string;
  created_at: string;
}

// 17. reviews
export interface Review {
  id: string;
  booking_id: string;
  accountant_id: string;
  customer_id: string;
  customer_name: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

// 18. disputes
export interface Dispute {
  id: string;
  booking_id: string;
  opened_by_id: string;
  opened_by_role: 'customer' | 'accountant';
  reason: string;
  details: string;
  status: DisputeStatus;
  admin_decision?: string;
  resolved_at?: string;
  created_at: string;
}

// 19. notifications
export interface NotificationItem {
  id: string;
  user_id: string;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: 'booking' | 'payment' | 'chat' | 'payout' | 'system' | 'dispute';
  is_read: boolean;
  link?: string;
  created_at: string;
}

// 20. favorites
export interface Favorite {
  id: string;
  customer_id: string;
  accountant_id: string;
  created_at: string;
}

// 21. platform_settings
export interface PlatformSettings {
  commission_rate: number; // default 0.15 (15%)
  auto_complete_hours: number; // default 24
  cancellation_grace_hours: number; // default 12
  currency: string; // 'EGP'
  payout_threshold_piasters: number; // default 50000 (500 EGP)
  support_email: string;
  support_phone: string;
}

// 22. audit_logs
export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  target_entity: string;
  target_id: string;
  details: string;
  created_at: string;
}
