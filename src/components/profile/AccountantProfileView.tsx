import React from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import {
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  Award,
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Video,
  MessageSquare,
} from 'lucide-react';

interface AccountantProfileViewProps {
  accountantId: string;
  onBack: () => void;
  onBook: (accountantId: string, serviceId?: string) => void;
}

export const AccountantProfileView: React.FC<AccountantProfileViewProps> = ({
  accountantId,
  onBack,
  onBook,
}) => {
  const { language, accountantProfiles, profiles, services, slots, reviews } = useStore();
  const t = translations[language];

  const profile = profiles.find((p) => p.id === accountantId);
  const accountant = accountantProfiles.find((ap) => ap.profile_id === accountantId);

  if (!profile || !accountant) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-500">المحاسب غير موجود أو لم يتم اعتماده بعد.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#142B43] text-white text-xs font-bold rounded-xl"
        >
          العودة للدليل
        </button>
      </div>
    );
  }

  const accountantServices = services.filter((s) => s.accountant_id === accountantId && s.is_active);
  const accountantSlots = slots.filter((s) => s.accountant_id === accountantId && !s.is_booked);
  const accountantReviews = reviews.filter((r) => r.accountant_id === accountantId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#142B43] transition"
      >
        {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{language === 'ar' ? 'العودة إلى دليل المحاسبين' : 'Back to Directory'}</span>
      </button>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#D6AE57]"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#142B43]">
                  {profile.full_name}
                </h1>
                {accountant.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.directory.certified}</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                {accountant.title}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {accountant.years_of_experience} {t.directory.years}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {accountant.rating.toFixed(2)} ({accountant.reviews_count} {language === 'ar' ? 'تقييم' : 'reviews'})
                </span>
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="w-full sm:w-auto text-start sm:text-end shrink-0">
            <span className="text-xs text-slate-400 block">{language === 'ar' ? 'سعر الجلسة يبدأ من' : 'Rate from'}</span>
            <span className="text-2xl font-black text-[#142B43] block">
              {formatEGP(accountant.hourly_rate_piasters, language)}
            </span>
            <button
              type="button"
              onClick={() => onBook(accountantId)}
              className="mt-3 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              {t.directory.bookNow}
            </button>
          </div>
        </div>

        {/* Sub-specialties tags */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#142B43]">
            {language === 'ar' ? 'مجالات الخبرة:' : 'Specialties:'}
          </span>
          {accountant.sub_specialties.map((sub, i) => (
            <span
              key={i}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
            >
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid: Bio, Credentials & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Bio Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-[#142B43] uppercase tracking-wider">
              {language === 'ar' ? 'نبذة مهنية' : 'Professional Bio'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {accountant.bio}
            </p>
          </div>

          {/* Education & Official Accreditation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#142B43] uppercase tracking-wider">
              {language === 'ar' ? 'المؤهلات والاعتماد الرسمي' : 'Qualifications & Official Registry'}
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D6AE57] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#142B43]">
                    {language === 'ar' ? 'القيد بسجل المحاسبين والمراجعين' : 'Egyptian CPA Register'}
                  </p>
                  <p className="text-slate-500 mt-0.5">رقم الترخيص: {accountant.license_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#142B43]">
                    {language === 'ar' ? 'المؤهل الأكاديمي' : 'Degree & Academic Background'}
                  </p>
                  <p className="text-slate-500 mt-0.5">{accountant.education}</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="font-bold text-[#142B43] mb-2">
                  {language === 'ar' ? 'الشهادات والعضويات المهنية:' : 'Certifications & Memberships:'}
                </p>
                <ul className="space-y-1.5">
                  {accountant.certifications.map((cert, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#142B43] uppercase tracking-wider">
                {language === 'ar' ? 'تقييمات وآراء العملاء' : 'Client Reviews'}
              </h2>
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                {accountant.rating.toFixed(2)} / 5.0
              </span>
            </div>

            {accountantReviews.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد تقييمات مكتوبة بعد لهذا المحاسب.</p>
            ) : (
              <div className="space-y-3">
                {accountantReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#142B43]">{rev.customer_name}</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(rev.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Services Offered & Booking Widget */}
        <div className="lg:col-span-5 space-y-6">
          {/* Services Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#142B43] uppercase tracking-wider">
              {language === 'ar' ? 'الخدمات المتاحة للحجز' : 'Available Consultation Services'}
            </h2>

            <div className="space-y-3">
              {accountantServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#D6AE57] transition space-y-2 bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-[#142B43]">
                      {language === 'ar' ? srv.name_ar : srv.name_en}
                    </h3>
                    <span className="text-xs font-extrabold text-[#142B43] shrink-0">
                      {formatEGP(srv.price_piasters, language)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {language === 'ar' ? srv.description_ar : srv.description_en}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {srv.duration_minutes} {language === 'ar' ? 'دقيقة' : 'min'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onBook(accountantId, srv.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#142B43] text-white font-bold text-[11px] hover:bg-[#1C3552] transition cursor-pointer"
                    >
                      {t.directory.bookNow}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Slots Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#142B43] uppercase tracking-wider">
                {language === 'ar' ? 'أقرب المواعيد المتاحة' : 'Upcoming Available Slots'}
              </h2>
              <Calendar className="w-4 h-4 text-[#D6AE57]" />
            </div>

            {accountantSlots.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد مواعيد شاغرة مسجلة حالياً.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {accountantSlots.slice(0, 4).map((slot) => {
                  const d = new Date(slot.start_time);
                  return (
                    <div
                      key={slot.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center"
                    >
                      <span className="block font-bold text-[#142B43]">
                        {d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                          weekday: 'short',
                          month: 'numeric',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {d.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
