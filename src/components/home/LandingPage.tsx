import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import {
  Scale,
  Search,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  FileText,
  TrendingUp,
  Briefcase,
  CheckSquare,
  HelpCircle,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface LandingPageProps {
  onSelectAccountant: (accountantId: string) => void;
  onBookAccountant: (accountantId: string) => void;
  onNavigate: (view: string, searchParam?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectAccountant,
  onBookAccountant,
  onNavigate,
}) => {
  const { language, accountantProfiles, profiles, categories } = useStore();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('directory', searchQuery);
  };

  const getProfile = (profileId: string) => profiles.find((p) => p.id === profileId);

  // Category icons mapping
  const categoryIcons: Record<string, React.ReactNode> = {
    'cat-1': <Scale className="w-6 h-6 text-[#D6AE57]" />,
    'cat-2': <FileText className="w-6 h-6 text-[#239B76]" />,
    'cat-3': <TrendingUp className="w-6 h-6 text-[#142B43]" />,
    'cat-4': <Briefcase className="w-6 h-6 text-amber-600" />,
    'cat-5': <CheckSquare className="w-6 h-6 text-indigo-600" />,
  };

  const faqs = [
    {
      q: language === 'ar' ? 'كيف تضمن مِيزان كفاءة المحاسبين المعتمدين؟' : 'How does MEEZAN verify certified accountants?',
      a: language === 'ar'
        ? 'يمر كل محاسب بعملية تدقيق صارمة من إدارة المنصة تشمل التحقق من رقم القيد بسجل المحاسبين والمراجعين بوزارة المالية المصرية، والشهادات الأكاديمية والمهنية وسنوات الخبرة العملية قبل نشر ملفه.'
        : 'Every CPA undergoes strict audit verifying their registration in the official Egyptian Accountants and Auditors Registry, credentials, and documented experience.',
    },
    {
      q: language === 'ar' ? 'كيف يتم احتساب الأسعار وعمولة المنصة؟' : 'How are prices and platform commissions structured?',
      a: language === 'ar'
        ? 'تحدد قيمة الاستشارة بشفافية تامة من المحاسب بالجنيه المصري EGP. عمولة المنصة 15% وتُخصم داخلياً من أتعاب المحاسب (85%) دون أي رسوم خفية أو إضافية على العميل النهائي.'
        : 'Prices are transparently set in EGP. The 15% platform commission is deducted internally from the accountant payout (85%), with zero hidden fees for the individual client.',
    },
    {
      q: language === 'ar' ? 'ماذا يحدث إذا تعذر حضور الموعد أو واجهت مشكلة؟' : 'What happens if a session is missed or an issue arises?',
      a: language === 'ar'
        ? 'يمكنك إلغاء أو تعديل الموعد وفق سياسة الإلغاء، أو فتح شكوى/نزاع في حال عدم التزام المحاسب، حيث تقوم إدارة المنصة بالتحقيق وإعادة المبلغ فوراً لحسابك إذا ثبت تقصير الطرف الآخر.'
        : 'You can reschedule or cancel according to policy, or open a formal dispute for prompt review and refund by platform administration.',
    },
    {
      q: language === 'ar' ? 'هل مستنداتي الضريبية وبياناتي المالية آمنة وسرية؟' : 'Are my tax sheets and financial documents private?',
      a: language === 'ar'
        ? 'نعم تماماً. يتم تشفير الملفات والمحادثات المتبادلة ولا يمكن الوصول إليها إلا من طرفك ومحاسبك المعتمد المختار، وتخضع لسياسات سرية مهنية مشددة.'
        : 'Yes, all files and chats are strictly partitioned per booking, accessible exclusively to you and your authorized accountant.',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#F5F7FA] pt-12 lg:pt-20 pb-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Start: Text & Search */}
            <div className="lg:col-span-7 space-y-6 text-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D6AE57]" />
                <span>{language === 'ar' ? 'المنصة المحاسبية الأولى للأفراد في مصر' : 'Egypt’s Premier B2C Accounting Hub'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142B43] tracking-tight leading-[1.2]">
                {t.home.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#758394] max-w-2xl leading-relaxed font-normal">
                {t.home.heroSubtitle}
              </p>

              {/* Instant Search Bar */}
              <form
                onSubmit={handleSearch}
                className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2 max-w-2xl"
              >
                <div className="flex items-center gap-2.5 px-3 w-full sm:flex-1 py-1.5">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    className="w-full text-sm bg-transparent border-0 focus:outline-none text-[#172B3A] placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>{t.home.searchBtn}</span>
                  {language === 'ar' ? <ArrowLeft className="w-4 h-4 text-[#D6AE57]" /> : <ArrowRight className="w-4 h-4 text-[#D6AE57]" />}
                </button>
              </form>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                <span className="font-semibold text-[#142B43]">
                  {language === 'ar' ? 'الأكثر طلباً:' : 'Popular:'}
                </span>
                {['فحص ضريبي', 'إقرار إلكتروني', 'محاسبة أطباء', 'ميزانية شخصية'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onNavigate('directory', tag)}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-[#D6AE57] hover:text-[#142B43] transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right/End: High-Fidelity Modern Visual Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-br from-[#142B43] to-[#1C3552] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-700/60 overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-12 -end-12 w-48 h-48 rounded-full bg-[#D6AE57]/15 blur-2xl pointer-events-none"></div>

                {/* Card Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-700/80">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#D6AE57] text-[#142B43] flex items-center justify-center font-bold shadow-md">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">مِيزان للثقة المالية</h3>
                      <p className="text-xs text-slate-300">نظام محاسبي مزدوج القيد</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    EGP 100%
                  </span>
                </div>

                {/* Visual metrics showcase */}
                <div className="py-6 space-y-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-300">أتعاب الاستشارة (أحمد القاضي)</p>
                      <p className="text-xl font-black text-white">1,000.00 ج.م</p>
                    </div>
                    <div className="text-end text-xs">
                      <span className="text-[#D6AE57] font-semibold block">مستحق المحاسب: 85%</span>
                      <span className="text-slate-400">عمولة المنصة: 15%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-slate-400">سجل المحاسبين</p>
                      <p className="font-bold text-slate-100 mt-1">مقيد ومعتمد رسمياً</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-slate-400">حماية الدفع</p>
                      <p className="font-bold text-emerald-300 mt-1">ضمان استرداد كامل</p>
                    </div>
                  </div>
                </div>

                {/* Floating mini CTA */}
                <button
                  type="button"
                  onClick={() => onNavigate('directory')}
                  className="w-full py-3 rounded-xl bg-[#D6AE57] hover:bg-[#c49d47] text-[#142B43] font-bold text-sm text-center shadow-lg transition"
                >
                  {t.home.findAccountantBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIALTIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#142B43]">
            {t.home.specialtiesTitle}
          </h2>
          <p className="text-sm text-[#758394] mt-2">
            {t.home.specialtiesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onNavigate('directory', language === 'ar' ? cat.name_ar : cat.name_en)}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#D6AE57] hover:shadow-md transition text-start group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {categoryIcons[cat.id] || <Scale className="w-6 h-6 text-[#142B43]" />}
                </div>
                <h3 className="text-sm font-bold text-[#142B43] group-hover:text-[#D6AE57] transition">
                  {language === 'ar' ? cat.name_ar : cat.name_en}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {language === 'ar' ? cat.description_ar : cat.description_en}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-400 group-hover:text-[#142B43] flex items-center gap-1">
                <span>{language === 'ar' ? 'استعرض المحاسبين' : 'View CPAs'}</span>
                {language === 'ar' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED CERTIFIED ACCOUNTANTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142B43]">
              {t.home.featuredAccountantsTitle}
            </h2>
            <p className="text-sm text-[#758394] mt-1">
              {t.home.featuredAccountantsSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('directory')}
            className="text-sm font-bold text-[#142B43] hover:text-[#D6AE57] flex items-center gap-1 transition"
          >
            <span>{language === 'ar' ? 'عرض جميع المحاسبين (دليل كامل)' : 'View All Accountants'}</span>
            {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accountantProfiles.filter((ap) => ap.is_published).slice(0, 4).map((ap) => {
            const profile = getProfile(ap.profile_id);
            if (!profile) return null;

            return (
              <div
                key={ap.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#D6AE57] shadow-xs hover:shadow-lg transition flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  {/* Top: Avatar & Badges */}
                  <div className="flex items-start gap-3">
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="text-sm font-bold text-[#142B43] truncate">
                          {profile.full_name}
                        </h3>
                        {ap.is_verified && (
                          <ShieldCheck className="w-4 h-4 text-[#239B76] shrink-0" title="محاسب معتمد رسمياً" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {profile.city}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="ms-1">{ap.rating.toFixed(2)}</span>
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          ({ap.reviews_count} {language === 'ar' ? 'تقييم' : 'reviews'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="mt-4">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-[#142B43]">
                      {ap.specialty}
                    </span>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {ap.bio}
                    </p>
                  </div>

                  {/* Experience & Fee */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ap.years_of_experience} {language === 'ar' ? 'سنة خبرة' : 'years exp'}</span>
                    </div>
                    <div className="text-end">
                      <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'سعر الجلسة' : 'Rate'}</span>
                      <span className="text-sm font-bold text-[#142B43]">
                        {formatEGP(ap.hourly_rate_piasters, language)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectAccountant(ap.profile_id)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs transition"
                  >
                    {t.directory.viewProfile}
                  </button>
                  <button
                    type="button"
                    onClick={() => onBookAccountant(ap.profile_id)}
                    className="flex-1 py-2 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white font-bold text-xs transition shadow-xs"
                  >
                    {t.directory.bookNow}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142B43]">
              {t.home.howItWorksTitle}
            </h2>
            <p className="text-sm text-[#758394] mt-2">
              {t.home.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: t.home.step1Title, desc: t.home.step1Desc },
              { num: '02', title: t.home.step2Title, desc: t.home.step2Desc },
              { num: '03', title: t.home.step3Title, desc: t.home.step3Desc },
              { num: '04', title: t.home.step4Title, desc: t.home.step4Desc },
            ].map((step) => (
              <div key={step.num} className="relative p-6 rounded-2xl bg-[#F5F7FA] border border-slate-200">
                <span className="text-3xl font-black text-[#D6AE57]/40 block mb-2">{step.num}</span>
                <h3 className="text-base font-bold text-[#142B43] mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE MEEZAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-[#D6AE57] uppercase tracking-wider">
              {language === 'ar' ? 'الضمان والاحتراف' : 'Trust & Compliance'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142B43]">
              {t.home.whyMeezanTitle}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.home.whyMeezanSubtitle}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('directory')}
                className="px-6 py-3 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white font-bold text-sm shadow-md transition"
              >
                {t.home.findAccountantBtn}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: t.home.benefit1Title, desc: t.home.benefit1Desc },
              { title: t.home.benefit2Title, desc: t.home.benefit2Desc },
              { title: t.home.benefit3Title, desc: t.home.benefit3Desc },
              { title: t.home.benefit4Title, desc: t.home.benefit4Desc },
            ].map((b, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-[#239B76]/10 text-[#239B76] flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#142B43] mb-1">{b.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#142B43]">
            {t.home.faqTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'ar' ? 'إجابات على أهم الاستفسارات الشائعة حول خدمات منصة مِيزان' : 'Common questions regarding Meezan services and guarantees'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-start p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#142B43]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-[#D6AE57]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
