-- ==============================================================================
-- MEEZAN | مِيزان - B2C Accounting Consultation Marketplace
-- Supabase PostgreSQL Schema & Security Blueprint
-- Migration: 20261101_init_meezan_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles (Customers, Accountants, Admins)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'accountant', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    city VARCHAR(100) DEFAULT 'القاهرة',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Accountant Applications (Accreditation pipeline)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.accountant_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    tax_card_number VARCHAR(100),
    years_of_experience INT NOT NULL CHECK (years_of_experience >= 0),
    specialties TEXT[] NOT NULL DEFAULT '{}',
    bio TEXT NOT NULL,
    degrees TEXT NOT NULL,
    certifications TEXT[] NOT NULL DEFAULT '{}',
    documents_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(25) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'needs_info')),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Accountant Profiles (Public Directory)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.accountant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    specialty VARCHAR(150) NOT NULL,
    sub_specialties TEXT[] NOT NULL DEFAULT '{}',
    years_of_experience INT NOT NULL DEFAULT 1,
    hourly_rate_piasters BIGINT NOT NULL CHECK (hourly_rate_piasters >= 0),
    bio TEXT NOT NULL,
    education TEXT NOT NULL,
    certifications TEXT[] NOT NULL DEFAULT '{}',
    license_number VARCHAR(100) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
    reviews_count INT NOT NULL DEFAULT 0,
    consultation_methods TEXT[] NOT NULL DEFAULT ARRAY['video', 'chat']::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Service Categories
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    icon VARCHAR(100) DEFAULT 'Briefcase',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 5. Services
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
    accountant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    price_piasters BIGINT NOT NULL CHECK (price_piasters > 0),
    duration_minutes INT NOT NULL DEFAULT 45 CHECK (duration_minutes > 0),
    consultation_type VARCHAR(50) NOT NULL DEFAULT 'video' CHECK (consultation_type IN ('video', 'chat', 'in_person')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 6. Availability Slots
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.availability_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accountant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    booking_id UUID,
    CONSTRAINT check_slot_times CHECK (end_time > start_time)
);

-- ------------------------------------------------------------------------------
-- 7. Bookings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    accountant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    slot_id UUID REFERENCES public.availability_slots(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'requested' CHECK (
        status IN ('requested', 'awaiting_payment', 'paid', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed', 'refunded')
    ),
    total_amount_piasters BIGINT NOT NULL CHECK (total_amount_piasters >= 0),
    commission_rate NUMERIC(4,3) NOT NULL DEFAULT 0.150,
    platform_fee_piasters BIGINT NOT NULL CHECK (platform_fee_piasters >= 0),
    accountant_payout_piasters BIGINT NOT NULL CHECK (accountant_payout_piasters >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_booking_balance CHECK (platform_fee_piasters + accountant_payout_piasters = total_amount_piasters)
);

-- ------------------------------------------------------------------------------
-- 8. Payments
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount_piasters BIGINT NOT NULL CHECK (amount_piasters > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
    provider VARCHAR(50) NOT NULL DEFAULT 'Meezan_Sandbox_Pay',
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    payment_method VARCHAR(30) NOT NULL DEFAULT 'card' CHECK (payment_method IN ('card', 'fawry', 'wallet')),
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Payment Webhook Events
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(100) UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    is_processed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. Payouts
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accountant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount_piasters BIGINT NOT NULL CHECK (amount_piasters > 0),
    bank_name VARCHAR(150) NOT NULL,
    iban_or_account VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. Ledger Accounts (Double-Entry Chart of Accounts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ledger_accounts (
    account_number INT PRIMARY KEY,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
    balance_piasters BIGINT NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 12. Ledger Transactions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ledger_transactions (
    id VARCHAR(100) PRIMARY KEY,
    reference_type VARCHAR(50) NOT NULL CHECK (reference_type IN ('booking_payment', 'payout_settlement', 'refund', 'adjustment')),
    reference_id VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_reversed BOOLEAN NOT NULL DEFAULT FALSE,
    reversed_by_id VARCHAR(100) REFERENCES public.ledger_transactions(id)
);

-- ------------------------------------------------------------------------------
-- 13. Ledger Entries (Debits & Credits)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id VARCHAR(100) PRIMARY KEY,
    transaction_id VARCHAR(100) NOT NULL REFERENCES public.ledger_transactions(id) ON DELETE CASCADE,
    account_number INT NOT NULL REFERENCES public.ledger_accounts(account_number) ON DELETE RESTRICT,
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('debit', 'credit')),
    amount_piasters BIGINT NOT NULL CHECK (amount_piasters > 0)
);

-- ------------------------------------------------------------------------------
-- 14. Conversations
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    accountant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. Messages
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    sender_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    attachment_url TEXT,
    attachment_name TEXT,
    attachment_type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 16. Documents
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_kb INT NOT NULL CHECK (file_size_kb > 0),
    file_url TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 17. Reviews
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    accountant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    customer_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 18. Disputes
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    opened_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    opened_by_role VARCHAR(20) NOT NULL CHECK (opened_by_role IN ('customer', 'accountant')),
    reason VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_investigation', 'resolved_refunded', 'resolved_released', 'dismissed')),
    admin_decision TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 19. Notifications
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    message_ar TEXT NOT NULL,
    message_en TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'system',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 20. Favorites
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    accountant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_customer_fav_accountant UNIQUE (customer_id, accountant_id)
);

-- ------------------------------------------------------------------------------
-- 21. Platform Settings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id INT PRIMARY KEY DEFAULT 1,
    commission_rate NUMERIC(4,3) NOT NULL DEFAULT 0.150,
    auto_complete_hours INT NOT NULL DEFAULT 24,
    cancellation_grace_hours INT NOT NULL DEFAULT 12,
    currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
    payout_threshold_piasters BIGINT NOT NULL DEFAULT 50000,
    support_email VARCHAR(150) NOT NULL DEFAULT 'support@meezan.eg',
    support_phone VARCHAR(50) NOT NULL DEFAULT '+20 2 2456 7890',
    CONSTRAINT singleton_settings CHECK (id = 1)
);

-- ------------------------------------------------------------------------------
-- 22. Audit Logs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR SCALE & SPEED
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_accountant_profiles_published ON public.accountant_profiles(is_published, is_verified);
CREATE INDEX IF NOT EXISTS idx_accountant_profiles_rating ON public.accountant_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_accountant ON public.bookings(accountant_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account ON public.ledger_entries(account_number);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;

-- 1. Profiles policy
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Bookings policy: Customers & Accountants see only their bookings; Admin sees all
CREATE POLICY "Bookings viewable by participants or admin" ON public.bookings
  FOR SELECT USING (
    auth.uid() = customer_id OR 
    auth.uid() = accountant_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Messages policy: Only conversation participants or admin
CREATE POLICY "Messages viewable by conversation participants" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = conversation_id AND (c.customer_id = auth.uid() OR c.accountant_id = auth.uid())
    ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Double-Entry Ledger: Admins only
CREATE POLICY "Ledger restricted to administrators" ON public.ledger_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Initial Chart of Accounts Data
INSERT INTO public.ledger_accounts (account_number, name_ar, name_en, type, balance_piasters)
VALUES 
  (1000, 'أموال لدى مزود الدفع', 'Funds with Payment Gateway', 'asset', 0),
  (1100, 'البنك / حساب التسوية', 'Bank / Settlement Account', 'asset', 0),
  (2000, 'مستحقات المحاسبين', 'Accountant Payouts Payable', 'liability', 0),
  (2100, 'التزامات الاسترداد', 'Refund Liabilities', 'liability', 0),
  (4000, 'إيرادات عمولة المنصة', 'Platform Commission Revenue', 'revenue', 0),
  (5000, 'رسوم بوابة الدفع', 'Payment Gateway Fees', 'expense', 0),
  (5100, 'مصروفات تشغيلية', 'Operating Expenses', 'expense', 0)
ON CONFLICT (account_number) DO NOTHING;

-- Initial Platform Settings
INSERT INTO public.platform_settings (id, commission_rate, auto_complete_hours, cancellation_grace_hours, currency, payout_threshold_piasters)
VALUES (1, 0.150, 24, 12, 'EGP', 50000)
ON CONFLICT (id) DO NOTHING;
