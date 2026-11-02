/**
 * Comprehensive Seed Data for MEEZAN Platform Prototype
 * Fully realistic Egyptian market data with verified certified accountants, EGP pricing, slots, bookings, and ledger entries.
 */

import {
  Profile,
  AccountantProfile,
  AccountantApplication,
  ServiceCategory,
  Service,
  AvailabilitySlot,
  Booking,
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

export const SEED_PROFILES: Profile[] = [
  // Admin
  {
    id: 'user-admin-1',
    role: 'admin',
    full_name: 'م. طارق العوضي',
    email: 'admin@meezan.eg',
    phone: '+20 100 123 4567',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    city: 'القاهرة - التجمع الخامس',
    is_active: true,
    created_at: '2026-01-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z',
  },
  // Accountant 1 (Certified & Published)
  {
    id: 'user-acc-1',
    role: 'accountant',
    full_name: 'أ. أحمد عبد الرحمن القاضي',
    email: 'ahmed.kadi@meezan.eg',
    phone: '+20 109 876 5432',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    city: 'القاهرة - مصر الجديدة',
    is_active: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  // Accountant 2 (Certified & Published)
  {
    id: 'user-acc-2',
    role: 'accountant',
    full_name: 'أ. فاطمة الزهراء الشناوي',
    email: 'fatma.shinawy@meezan.eg',
    phone: '+20 112 345 6789',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    city: 'الجيزة - الدقي',
    is_active: true,
    created_at: '2026-01-12T11:00:00Z',
    updated_at: '2026-01-12T11:00:00Z',
  },
  // Accountant 3 (Certified & Published)
  {
    id: 'user-acc-3',
    role: 'accountant',
    full_name: 'أ. محمود سراج الدين',
    email: 'mahmoud.serag@meezan.eg',
    phone: '+20 122 998 7766',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    city: 'الإسكندرية - سموحة',
    is_active: true,
    created_at: '2026-01-15T09:30:00Z',
    updated_at: '2026-01-15T09:30:00Z',
  },
  // Accountant 4 (Certified & Published)
  {
    id: 'user-acc-4',
    role: 'accountant',
    full_name: 'أ. سارة إبراهيم المنشاوي',
    email: 'sara.menshawy@meezan.eg',
    phone: '+20 106 554 4332',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    city: 'المنصورة - المشاية',
    is_active: true,
    created_at: '2026-02-01T12:00:00Z',
    updated_at: '2026-02-01T12:00:00Z',
  },
  // Accountant 5 (Pending Application)
  {
    id: 'user-acc-pending',
    role: 'accountant',
    full_name: 'أ. كريم حمدي النجار',
    email: 'karim.naggar@meezan.eg',
    phone: '+20 115 443 2211',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    city: 'القاهرة - المعادي',
    is_active: true,
    created_at: '2026-02-20T14:00:00Z',
    updated_at: '2026-02-20T14:00:00Z',
  },
  // Customer 1
  {
    id: 'user-cust-1',
    role: 'customer',
    full_name: 'عمر عبد العزيز شريف',
    email: 'omar.sherif@example.com',
    phone: '+20 101 234 5678',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    city: 'القاهرة - مدينة نصر',
    is_active: true,
    created_at: '2026-01-20T14:00:00Z',
    updated_at: '2026-01-20T14:00:00Z',
  },
  // Customer 2
  {
    id: 'user-cust-2',
    role: 'customer',
    full_name: 'د. منى النجار',
    email: 'mona.naggar@example.com',
    phone: '+20 114 987 6543',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    city: 'الجيزة - الشيخ زايد',
    is_active: true,
    created_at: '2026-02-05T16:00:00Z',
    updated_at: '2026-02-05T16:00:00Z',
  },
];

export const SEED_ACCOUNTANT_PROFILES: AccountantProfile[] = [
  {
    id: 'ap-1',
    profile_id: 'user-acc-1',
    title: 'محاسب قانوني معتمد ومستشار ضرائب الدخل والمبيعات',
    specialty: 'الاستشارات الضريبية والفحص الضريبي',
    sub_specialties: ['ضرائب المهن غير التجارية', 'الفاتورة والإيصال الإلكتروني', 'فض المنازعات الضريبية'],
    years_of_experience: 14,
    hourly_rate_piasters: 100000, // 1,000 EGP
    bio: 'زميل جمعية المحاسبين والمراجعين المصرية (ESAA). أكثر من 14 عاماً في تقديم الاستشارات الضريبية المتخصصة للأفراد والمهنيين المستقلين وحل مشاكل الفحص الضريبي بنجاح.',
    education: 'بكالوريوس تجارة - شعبة محاسبة، جامعة عين شمس (مرتبة شرف). دبلوم دراسات عليا في الضرائب.',
    certifications: [
      'محاسب قانوني معتمد (سجل المحاسبين والمراجعين رقم 18452)',
      'عضو جمعية الضرائب المصرية',
      'خبير ضرائب الدخل والقيمة المضافة المعتمد',
    ],
    license_number: 'EGY-CPA-18452',
    is_verified: true,
    is_published: true,
    rating: 4.95,
    reviews_count: 38,
    consultation_methods: ['video', 'chat'],
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'ap-2',
    profile_id: 'user-acc-2',
    title: 'مستشارة الإقرارات الضريبية والمحاسبة الشخصية للمهنيين',
    specialty: 'إقرارات الأفراد والمحاسبة الشخصية',
    sub_specialties: ['إقرارات الدخل السنوية', 'حساب صافي الأرباح للمستقلين', 'تخطيط الالتزامات'],
    years_of_experience: 9,
    hourly_rate_piasters: 80000, // 800 EGP
    bio: 'خبيرة متخصصة في إعداد ومراجعة الإقرارات الضريبية الإلكترونية للأطباء والمهندسين وأصحاب الأعمال الحرة، ومساعدتهم في الامتثال القانوني وحماية حقوقهم.',
    education: 'بكالوريوس محاسبة - جامعة القاهرة، ماجستير إدارة مالية.',
    certifications: [
      'محاسب قانوني مقيد برقم 24901',
      'شهادة الاعتماد من منظومة الضرائب المصرية الإلكترونية',
    ],
    license_number: 'EGY-CPA-24901',
    is_verified: true,
    is_published: true,
    rating: 4.88,
    reviews_count: 24,
    consultation_methods: ['video', 'chat', 'in_person'],
    created_at: '2026-01-12T11:00:00Z',
    updated_at: '2026-01-12T11:00:00Z',
  },
  {
    id: 'ap-3',
    profile_id: 'user-acc-3',
    title: 'مستشار التخطيط المالي والمشروعات الفردية والناشئة',
    specialty: 'استشارات المشروعات الصغيرة والتخطيط المالي',
    sub_specialties: ['دراسات الجدوى المالية للأفراد', 'هيكلة التكاليف', 'إدارة التدفق النقدي الشخصي'],
    years_of_experience: 12,
    hourly_rate_piasters: 120000, // 1,200 EGP
    bio: 'شغفي مساعدة الأفراد في تنظيم مواردهم المالية، والبدء بمشروعاتهم الخاصة بحسابات دقيقة وتوقعات واقعية تضمن الاستقرار وتفادي الخسائر المفاجئة.',
    education: 'بكالوريوس تجارة - جامعة الإسكندرية، شهادة CFA المستوى الثاني.',
    certifications: [
      'محاسب ومراجع قانوني مقيد رقم 19743',
      'مستشار مالي معتمد للأعمال الصغيرة',
    ],
    license_number: 'EGY-CPA-19743',
    is_verified: true,
    is_published: true,
    rating: 4.91,
    reviews_count: 19,
    consultation_methods: ['video', 'chat'],
    created_at: '2026-01-15T09:30:00Z',
    updated_at: '2026-01-15T09:30:00Z',
  },
  {
    id: 'ap-4',
    profile_id: 'user-acc-4',
    title: 'أخصائية مراجعة الحسابات وتدقيق المستندات المالية',
    specialty: 'مراجعة المستندات والقوائم المالية',
    sub_specialties: ['مراجعة الفواتير والعقود', 'الميزانيات التقديرية', 'التدقيق المالي للأفراد'],
    years_of_experience: 7,
    hourly_rate_piasters: 65000, // 650 EGP
    bio: 'مراجعة دقيقة لدفاترك ومستنداتك المالية وتصحيح الأخطاء المحاسبية والتأكد من مطابقتها للمعايير المصرية والدولية.',
    education: 'بكالوريوس تجارة - جامعة المنصورة.',
    certifications: [
      'محاسب قانوني مقيد رقم 31208',
      'عضو الجمعية المصرية للمالية العامة',
    ],
    license_number: 'EGY-CPA-31208',
    is_verified: true,
    is_published: true,
    rating: 4.82,
    reviews_count: 15,
    consultation_methods: ['video', 'chat'],
    created_at: '2026-02-01T12:00:00Z',
    updated_at: '2026-02-01T12:00:00Z',
  },
];

export const SEED_ACCOUNTANT_APPLICATIONS: AccountantApplication[] = [
  {
    id: 'app-pending-1',
    profile_id: 'user-acc-pending',
    full_name: 'أ. كريم حمدي النجار',
    email: 'karim.naggar@meezan.eg',
    phone: '+20 115 443 2211',
    license_number: 'EGY-CPA-35890',
    tax_card_number: '482-901-234',
    years_of_experience: 8,
    specialties: ['الاستشارات الضريبية', 'المحاسبة الشخصية'],
    bio: 'محاسب قانوني معتمد بخبرة 8 سنوات في مكاتب المحاسبة الكبرى بالقاهرة، أرغب بالانضمام لمنصة ميزان لخدمة شريحة المستقلين والمهنيين الأفراد.',
    degrees: 'بكالوريوس تجارة - جامعة حلوان، دبلوم المحاسبة والمراجعة 2018',
    certifications: ['عضو نقابة التجاريين - شعبة محاسبة ومراجعة'],
    documents_urls: [
      { name: 'شهادة_القيد_بسجل_المحاسبين.pdf', url: '#', type: 'application/pdf' },
      { name: 'البطاقة_الضريبية_والرقم_القومي.pdf', url: '#', type: 'application/pdf' },
      { name: 'شهادة_التخرج_والدرجات.pdf', url: '#', type: 'application/pdf' },
    ],
    status: 'pending',
    created_at: '2026-02-20T14:00:00Z',
  },
];

export const SEED_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-1',
    name_ar: 'الاستشارات الضريبية',
    name_en: 'Tax Consultations',
    description_ar: 'استشارات متخصصة في ضرائب الدخل، القيمة المضافة، والتعامل مع الفحص الضريبي للأفراد والمهنيين.',
    description_en: 'Expert consultations on income tax, VAT, and tax audit handling for individuals and professionals.',
    icon: 'Scale',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'cat-2',
    name_ar: 'الإقرارات الضريبية والمحاسبة الفردية',
    name_en: 'Tax Returns & Individual Accounting',
    description_ar: 'إعداد ومراجعة الإقرارات الضريبية السنوية والشهرية على المنظومة الإلكترونية لمصلحة الضرائب المصرية.',
    description_en: 'Preparation and review of tax returns on the Egyptian Tax Authority electronic portal.',
    icon: 'FileText',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'cat-3',
    name_ar: 'التخطيط المالي والميزانيات الشخصية',
    name_en: 'Financial Planning & Personal Budgets',
    description_ar: 'تنظيم المصروفات، إعداد خطط الادخار، والاستثمار الشخصي السليم لضمان الاستقرار المالي.',
    description_en: 'Expense structuring, saving plans, and personal wealth planning.',
    icon: 'TrendingUp',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'cat-4',
    name_ar: 'استشارات المشروعات الفردية والصغيرة',
    name_en: 'Micro-Business & Freelance Consulting',
    description_ar: 'توجيه المستقلين وأصحاب المشروعات الفردية لتأسيس حساباتهم، وتحديد الأسعار والتكاليف بدقة.',
    description_en: 'Guiding freelancers and solo entrepreneurs on bookkeeping, costing, and margins.',
    icon: 'Briefcase',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'cat-5',
    name_ar: 'مراجعة وتدقيق المستندات والقوائم',
    name_en: 'Document Review & Financial Auditing',
    description_ar: 'فحص العقود، مراجعة فواتيرك، والتأكد من سلامة القيود والمعاملات المحاسبية.',
    description_en: 'Verification of contracts, invoices, and accounting compliance.',
    icon: 'CheckSquare',
    display_order: 5,
    is_active: true,
  },
];

export const SEED_SERVICES: Service[] = [
  {
    id: 'srv-1',
    category_id: 'cat-1',
    accountant_id: 'user-acc-1',
    name_ar: 'استشارة فحص ضريبي للأفراد والمهن الحرة',
    name_en: 'Tax Audit Consultation for Freelancers',
    description_ar: 'جلسة استشارية مكثفة مدتها 45 دقيقة لمراجعة إخطارات الضرائب والاستعداد الأمثل لنموذج 19 أو الفحص الضريبي.',
    description_en: 'Comprehensive 45-minute consultation to review tax notices and prepare for tax audit procedures.',
    price_piasters: 100000, // 1,000 EGP
    duration_minutes: 45,
    consultation_type: 'video',
    is_active: true,
  },
  {
    id: 'srv-2',
    category_id: 'cat-2',
    accountant_id: 'user-acc-2',
    name_ar: 'إعداد ومراجعة الإقرار الضريبي الإلكتروني السنوي',
    name_en: 'Annual Electronic Tax Return Preparation',
    description_ar: 'حساب صافي الوعاء الضريبي، خصم التكاليف المعتمدة، ورفع الإقرار بدقة على موقع مصلحة الضرائب.',
    description_en: 'Calculation of net taxable base, deduction of approved costs, and official submission.',
    price_piasters: 80000, // 800 EGP
    duration_minutes: 60,
    consultation_type: 'video',
    is_active: true,
  },
  {
    id: 'srv-3',
    category_id: 'cat-3',
    accountant_id: 'user-acc-3',
    name_ar: 'جلسة إعداد الميزانية المالية الشخصية وخطة الادخار',
    name_en: 'Personal Financial Budgeting & Savings Strategy',
    description_ar: 'تحليل مصادر الدخل والمصروفات الشهرية ووضع خطة عملية لسداد الديون ومضاعفة المدخرات.',
    description_en: 'Detailed income and expense analysis to formulate a customized debt reduction and savings roadmap.',
    price_piasters: 95000, // 950 EGP
    duration_minutes: 50,
    consultation_type: 'video',
    is_active: true,
  },
  {
    id: 'srv-4',
    category_id: 'cat-4',
    accountant_id: 'user-acc-3',
    name_ar: 'استشارة تسعير وحساب تكاليف للمستقلين والمشروعات الفردية',
    name_en: 'Costing & Pricing Consultation for Solo Ventures',
    description_ar: 'كيف تحدد سعر خدماتك، وحساب نقطة التعادل، وهامش الربح الحقيقي بعد خصم التكاليف والضرائب.',
    description_en: 'Setting hourly and project rates, calculating break-even points and net profit margins.',
    price_piasters: 120000, // 1,200 EGP
    duration_minutes: 60,
    consultation_type: 'video',
    is_active: true,
  },
  {
    id: 'srv-5',
    category_id: 'cat-5',
    accountant_id: 'user-acc-4',
    name_ar: 'مراجعة وتدقيق المستندات المالية والفواتير',
    name_en: 'Financial Document & Invoice Verification',
    description_ar: 'مراجعة المستندات المالية والتحقق من صحتها الحسابية والقانونية قبل تقديمها للجهات الرسمية.',
    description_en: 'Auditing accounting slips, receipts, and invoices for accuracy and tax compliance.',
    price_piasters: 65000, // 650 EGP
    duration_minutes: 40,
    consultation_type: 'chat',
    is_active: true,
  },
];

export const SEED_SLOTS: AvailabilitySlot[] = [
  // Slots for Accountant 1 (Ahmed Kadi)
  {
    id: 'slot-1',
    accountant_id: 'user-acc-1',
    start_time: '2026-11-02T10:00:00.000Z',
    end_time: '2026-11-02T10:45:00.000Z',
    is_booked: true,
    booking_id: 'bk-101',
  },
  {
    id: 'slot-2',
    accountant_id: 'user-acc-1',
    start_time: '2026-11-02T11:30:00.000Z',
    end_time: '2026-11-02T12:15:00.000Z',
    is_booked: false,
  },
  {
    id: 'slot-3',
    accountant_id: 'user-acc-1',
    start_time: '2026-11-02T14:00:00.000Z',
    end_time: '2026-11-02T14:45:00.000Z',
    is_booked: false,
  },
  {
    id: 'slot-4',
    accountant_id: 'user-acc-1',
    start_time: '2026-11-03T16:00:00.000Z',
    end_time: '2026-11-03T16:45:00.000Z',
    is_booked: false,
  },
  // Slots for Accountant 2 (Fatma Shinawy)
  {
    id: 'slot-5',
    accountant_id: 'user-acc-2',
    start_time: '2026-11-02T13:00:00.000Z',
    end_time: '2026-11-02T14:00:00.000Z',
    is_booked: true,
    booking_id: 'bk-102',
  },
  {
    id: 'slot-6',
    accountant_id: 'user-acc-2',
    start_time: '2026-11-03T10:00:00.000Z',
    end_time: '2026-11-03T11:00:00.000Z',
    is_booked: false,
  },
  {
    id: 'slot-7',
    accountant_id: 'user-acc-2',
    start_time: '2026-11-03T15:00:00.000Z',
    end_time: '2026-11-03T16:00:00.000Z',
    is_booked: false,
  },
  // Slots for Accountant 3 (Mahmoud Serag)
  {
    id: 'slot-8',
    accountant_id: 'user-acc-3',
    start_time: '2026-11-02T17:00:00.000Z',
    end_time: '2026-11-02T18:00:00.000Z',
    is_booked: false,
  },
  {
    id: 'slot-9',
    accountant_id: 'user-acc-3',
    start_time: '2026-11-04T12:00:00.000Z',
    end_time: '2026-11-04T13:00:00.000Z',
    is_booked: false,
  },
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    booking_number: 'MZN-2026-1042',
    customer_id: 'user-cust-1',
    accountant_id: 'user-acc-1',
    service_id: 'srv-1',
    slot_id: 'slot-1',
    scheduled_at: '2026-11-02T10:00:00.000Z',
    duration_minutes: 45,
    notes: 'استلمت إشعار فحص ضريبي على دخل العمل الحر لعام 2024 وأحتاج توجيه فوري في المستندات المطلوبة.',
    status: 'in_progress',
    total_amount_piasters: 100000, // 1,000 EGP
    commission_rate: 0.15,
    platform_fee_piasters: 15000, // 150 EGP
    accountant_payout_piasters: 85000, // 850 EGP
    created_at: '2026-10-31T09:00:00.000Z',
    updated_at: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'bk-102',
    booking_number: 'MZN-2026-1038',
    customer_id: 'user-cust-2',
    accountant_id: 'user-acc-2',
    service_id: 'srv-2',
    slot_id: 'slot-5',
    scheduled_at: '2026-11-02T13:00:00.000Z',
    duration_minutes: 60,
    notes: 'مراجعة وتقديم إقرار الدخل السنوي للعيادة الخاصة.',
    status: 'paid',
    total_amount_piasters: 80000, // 800 EGP
    commission_rate: 0.15,
    platform_fee_piasters: 12000, // 120 EGP
    accountant_payout_piasters: 68000, // 680 EGP
    created_at: '2026-10-30T14:30:00.000Z',
    updated_at: '2026-10-30T14:40:00.000Z',
  },
  {
    id: 'bk-103',
    booking_number: 'MZN-2026-0985',
    customer_id: 'user-cust-1',
    accountant_id: 'user-acc-3',
    service_id: 'srv-3',
    slot_id: 'slot-8',
    scheduled_at: '2026-10-25T17:00:00.000Z',
    duration_minutes: 50,
    notes: 'جلسة تخطيط الميزانية الشخصية وخطة استثمار مدخرات.',
    status: 'completed',
    total_amount_piasters: 95000, // 950 EGP
    commission_rate: 0.15,
    platform_fee_piasters: 14250, // 142.50 EGP
    accountant_payout_piasters: 80750, // 807.50 EGP
    created_at: '2026-10-24T11:00:00.000Z',
    updated_at: '2026-10-25T18:00:00.000Z',
  },
];

export const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-101',
    booking_id: 'bk-101',
    customer_id: 'user-cust-1',
    amount_piasters: 100000,
    currency: 'EGP',
    provider: 'Meezan_Sandbox_Pay',
    transaction_id: 'SBX-TXN-984210',
    status: 'success',
    payment_method: 'card',
    idempotency_key: 'idem-bk-101-pay',
    created_at: '2026-10-31T09:05:00.000Z',
  },
  {
    id: 'pay-102',
    booking_id: 'bk-102',
    customer_id: 'user-cust-2',
    amount_piasters: 80000,
    currency: 'EGP',
    provider: 'Meezan_Sandbox_Pay',
    transaction_id: 'SBX-TXN-773419',
    status: 'success',
    payment_method: 'card',
    idempotency_key: 'idem-bk-102-pay',
    created_at: '2026-10-30T14:40:00.000Z',
  },
  {
    id: 'pay-103',
    booking_id: 'bk-103',
    customer_id: 'user-cust-1',
    amount_piasters: 95000,
    currency: 'EGP',
    provider: 'Meezan_Sandbox_Pay',
    transaction_id: 'SBX-TXN-551290',
    status: 'success',
    payment_method: 'fawry',
    idempotency_key: 'idem-bk-103-pay',
    created_at: '2026-10-24T11:10:00.000Z',
  },
];

export const SEED_PAYOUTS: Payout[] = [
  {
    id: 'payout-1',
    accountant_id: 'user-acc-3',
    amount_piasters: 80750, // 807.50 EGP
    bank_name: 'البنك التجاري الدولي (CIB)',
    iban_or_account: 'EG380010002000000123456789123',
    status: 'completed',
    processed_at: '2026-10-28T12:00:00.000Z',
    created_at: '2026-10-26T10:00:00.000Z',
  },
];

export const SEED_LEDGER_TRANSACTIONS: LedgerTransaction[] = [
  {
    id: 'tx-init-101',
    reference_type: 'booking_payment',
    reference_id: 'pay-101',
    description: 'تحصيل حجز استشارة MZN-2026-1042 - قيمة 1,000 ج.م (عمولة المنصة 15%)',
    posted_at: '2026-10-31T09:05:00.000Z',
    is_reversed: false,
  },
  {
    id: 'tx-init-102',
    reference_type: 'booking_payment',
    reference_id: 'pay-102',
    description: 'تحصيل حجز استشارة MZN-2026-1038 - قيمة 800 ج.م (عمولة المنصة 15%)',
    posted_at: '2026-10-30T14:40:00.000Z',
    is_reversed: false,
  },
  {
    id: 'tx-init-103',
    reference_type: 'booking_payment',
    reference_id: 'pay-103',
    description: 'تحصيل حجز استشارة MZN-2026-0985 - قيمة 950 ج.م (عمولة المنصة 15%)',
    posted_at: '2026-10-24T11:10:00.000Z',
    is_reversed: false,
  },
  {
    id: 'tx-init-payout-1',
    reference_type: 'payout_settlement',
    reference_id: 'payout-1',
    description: 'تسوية تحويل بنكي للمحاسب أ. محمود سراج الدين - مبلغ 807.50 ج.م',
    posted_at: '2026-10-28T12:00:00.000Z',
    is_reversed: false,
  },
];

export const SEED_LEDGER_ENTRIES: LedgerEntry[] = [
  // For tx-init-101 (1,000 EGP = 100,000 piasters)
  {
    id: 'le-101-dr',
    transaction_id: 'tx-init-101',
    account_number: 1000, // Dr. Funds with Payment Gateway
    entry_type: 'debit',
    amount_piasters: 100000,
  },
  {
    id: 'le-101-cr-payout',
    transaction_id: 'tx-init-101',
    account_number: 2000, // Cr. Accountant Payouts Payable
    entry_type: 'credit',
    amount_piasters: 85000,
  },
  {
    id: 'le-101-cr-comm',
    transaction_id: 'tx-init-101',
    account_number: 4000, // Cr. Platform Commission Revenue
    entry_type: 'credit',
    amount_piasters: 15000,
  },

  // For tx-init-102 (800 EGP = 80,000 piasters)
  {
    id: 'le-102-dr',
    transaction_id: 'tx-init-102',
    account_number: 1000,
    entry_type: 'debit',
    amount_piasters: 80000,
  },
  {
    id: 'le-102-cr-payout',
    transaction_id: 'tx-init-102',
    account_number: 2000,
    entry_type: 'credit',
    amount_piasters: 68000,
  },
  {
    id: 'le-102-cr-comm',
    transaction_id: 'tx-init-102',
    account_number: 4000,
    entry_type: 'credit',
    amount_piasters: 12000,
  },

  // For tx-init-103 (950 EGP = 95,000 piasters)
  {
    id: 'le-103-dr',
    transaction_id: 'tx-init-103',
    account_number: 1000,
    entry_type: 'debit',
    amount_piasters: 95000,
  },
  {
    id: 'le-103-cr-payout',
    transaction_id: 'tx-init-103',
    account_number: 2000,
    entry_type: 'credit',
    amount_piasters: 80750,
  },
  {
    id: 'le-103-cr-comm',
    transaction_id: 'tx-init-103',
    account_number: 4000,
    entry_type: 'credit',
    amount_piasters: 14250,
  },

  // For tx-init-payout-1 (Settlement 807.50 EGP)
  {
    id: 'le-payout-1-dr',
    transaction_id: 'tx-init-payout-1',
    account_number: 2000, // Dr. Accountant Payouts Payable
    entry_type: 'debit',
    amount_piasters: 80750,
  },
  {
    id: 'le-payout-1-cr',
    transaction_id: 'tx-init-payout-1',
    account_number: 1100, // Cr. Bank Settlement Account
    entry_type: 'credit',
    amount_piasters: 80750,
  },
];

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    booking_id: 'bk-101',
    customer_id: 'user-cust-1',
    accountant_id: 'user-acc-1',
    created_at: '2026-10-31T09:05:00.000Z',
  },
];

export const SEED_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversation_id: 'conv-101',
    sender_id: 'user-acc-1',
    sender_name: 'أ. أحمد عبد الرحمن',
    content: 'أهلاً بك أستاذ عمر. اطلعت على طلب استشارتك ومستعد لمراجعة ملف الفحص الضريبي معك.',
    is_read: true,
    created_at: '2026-10-31T09:10:00.000Z',
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-101',
    sender_id: 'user-cust-1',
    sender_name: 'عمر عبد العزيز',
    content: 'أهلاً بحضرتك يا أستاذ أحمد. قمت برفع إشعار مصلحة الضرائب وقائمة الفواتير المرفقة في قسم المستندات.',
    attachment_name: 'نموذج_إشعار_فحص_ضرائب.pdf',
    attachment_type: 'application/pdf',
    attachment_url: '#',
    is_read: true,
    created_at: '2026-10-31T09:15:00.000Z',
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-101',
    sender_id: 'user-acc-1',
    sender_name: 'أ. أحمد عبد الرحمن',
    content: 'ممتاز جداً، قمت بتحميل النموذج والاطلاع عليه. المأمورية تطلب كشف حساب بنكي ومؤيدات المصروفات. سنناقش كل بند تفصيلاً في موعد الاستشارة غداً.',
    is_read: true,
    created_at: '2026-10-31T09:30:00.000Z',
  },
];

export const SEED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    booking_id: 'bk-101',
    uploaded_by: 'user-cust-1',
    file_name: 'نموذج_إشعار_فحص_ضرائب.pdf',
    file_type: 'application/pdf',
    file_size_kb: 420,
    file_url: '#',
    notes: 'الإشعار الوارد من مأمورية ضرائب المهن الحرة',
    created_at: '2026-10-31T09:15:00.000Z',
  },
  {
    id: 'doc-2',
    booking_id: 'bk-101',
    uploaded_by: 'user-cust-1',
    file_name: 'كشف_إيرادات_ومصروفات_2024.xlsx',
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_size_kb: 180,
    file_url: '#',
    notes: 'ملخص الحسابات المصرفية ومصروفات التشغيل',
    created_at: '2026-10-31T09:18:00.000Z',
  },
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'bk-103',
    accountant_id: 'user-acc-3',
    customer_id: 'user-cust-1',
    customer_name: 'عمر عبد العزيز شريف',
    rating: 5,
    comment: 'استشارة ممتازة جداً وواضحة، ساعدني الأستاذ محمود في وضع ميزانية واقعية وتوفير مبالغ كنت أنفقها بدون تخطيط. أنصح بالتعامل معه بشدة.',
    created_at: '2026-10-25T18:30:00.000Z',
  },
  {
    id: 'rev-2',
    booking_id: 'bk-historical-1',
    accountant_id: 'user-acc-1',
    customer_id: 'user-cust-2',
    customer_name: 'د. منى النجار',
    rating: 5,
    comment: 'قمة في الاحترافية والدقة والاطلاع على أحدث تعليمات مصلحة الضرائب المصرية، حل لي إشكالاً كان يهدد بفرض غرامات.',
    created_at: '2026-10-15T14:00:00.000Z',
  },
];

export const SEED_DISPUTES: Dispute[] = [
  {
    id: 'disp-1',
    booking_id: 'bk-historical-9',
    opened_by_id: 'user-cust-2',
    opened_by_role: 'customer',
    reason: 'تأخر المحاسب عن الموعد المحدد',
    details: 'المحاسب اعتذر عن الحضور بعد انقضاء نصف ساعة من الموعد ولم يتم تقديم الاستشارة.',
    status: 'under_investigation',
    created_at: '2026-10-20T10:00:00.000Z',
  },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'user-cust-1',
    title_ar: 'تأكيد حجز الاستشارة',
    title_en: 'Consultation Booking Confirmed',
    message_ar: 'تم تأكيد حجزك رقم MZN-2026-1042 مع المحاسب أ. أحمد عبد الرحمن بنجاح.',
    message_en: 'Booking MZN-2026-1042 with Ahmed Kadi has been confirmed.',
    type: 'booking',
    is_read: false,
    link: 'bookings',
    created_at: '2026-10-31T09:05:00.000Z',
  },
  {
    id: 'notif-2',
    user_id: 'user-acc-1',
    title_ar: 'طلب استشارة جديد مدفوع',
    title_en: 'New Paid Consultation Request',
    message_ar: 'قام العميل عمر عبد العزيز بحجز استشارة فحص ضريبي، يرجى التنسيق معه.',
    message_en: 'Client Omar Sherif booked a tax consultation session.',
    type: 'booking',
    is_read: false,
    link: 'requests',
    created_at: '2026-10-31T09:05:00.000Z',
  },
  {
    id: 'notif-3',
    user_id: 'user-admin-1',
    title_ar: 'طلب اعتماد محاسب جديد',
    title_en: 'New Accountant Application',
    message_ar: 'قدم أ. كريم حمدي النجار طلباً جديداً للاعتماد كمحاسب قانوني على المنصة.',
    message_en: 'Karim Naggar submitted a new accreditation request.',
    type: 'system',
    is_read: false,
    link: 'applications',
    created_at: '2026-02-20T14:00:00.000Z',
  },
];

export const SEED_SETTINGS: PlatformSettings = {
  commission_rate: 0.15, // 15%
  auto_complete_hours: 24,
  cancellation_grace_hours: 12,
  currency: 'EGP',
  payout_threshold_piasters: 50000, // 500 EGP minimum payout
  support_email: 'support@meezan.eg',
  support_phone: '+20 2 2456 7890',
};

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actor_id: 'user-admin-1',
    actor_name: 'م. طارق العوضي (مدير)',
    action: 'اعتماد وتفعيل محاسب',
    target_entity: 'accountant_profiles',
    target_id: 'user-acc-1',
    details: 'تم فحص أوراق القيد بسجل المحاسبين والمراجعين واعتماد المحاسب أ. أحمد عبد الرحمن ونشر ملفه.',
    created_at: '2026-01-10T12:00:00.000Z',
  },
  {
    id: 'log-2',
    actor_id: 'user-admin-1',
    actor_name: 'م. طارق العوضي (مدير)',
    action: 'تحديث نسبة العمولة',
    target_entity: 'platform_settings',
    target_id: '1',
    details: 'تثبيت نسبة عمولة المنصة عند 15% وتطبيقها على جميع الحجوزات المستقبلية.',
    created_at: '2026-01-01T09:00:00.000Z',
  },
];
