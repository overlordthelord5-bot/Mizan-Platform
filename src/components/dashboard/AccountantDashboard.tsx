import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import { BookingStatus } from '../../types';
import {
  DollarSign,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Building,
  Send,
  ShieldCheck,
  Briefcase,
  Layers,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface AccountantDashboardProps {
  onOpenRoom: (bookingId: string) => void;
  activeSection?: string;
}

export const AccountantDashboard: React.FC<AccountantDashboardProps> = ({
  onOpenRoom,
  activeSection = 'overview',
}) => {
  const {
    currentUser,
    language,
    bookings,
    services,
    profiles,
    slots,
    accountantProfiles,
    payouts,
    reviews,
    acceptBooking,
    updateBookingStatus,
    addAvailabilitySlot,
    deleteAvailabilitySlot,
    requestPayout,
    platformSettings,
  } = useStore();

  const t = translations[language];

  const myAccountantProfile = accountantProfiles.find((ap) => ap.profile_id === currentUser.id);
  const myBookings = bookings.filter((b) => b.accountant_id === currentUser.id);
  const mySlots = slots.filter((s) => s.accountant_id === currentUser.id);
  const myServices = services.filter((s) => s.accountant_id === currentUser.id);
  const myPayouts = payouts.filter((p) => p.accountant_id === currentUser.id);
  const myReviews = reviews.filter((r) => r.accountant_id === currentUser.id);

  // Stats calculation
  const totalRequests = myBookings.length;
  const newRequests = myBookings.filter((b) => b.status === 'paid');
  const completedBookings = myBookings.filter((b) => b.status === 'completed');

  const grossEarningsPiasters = completedBookings.reduce((sum, b) => sum + b.total_amount_piasters, 0);
  const commissionDeductedPiasters = completedBookings.reduce((sum, b) => sum + b.platform_fee_piasters, 0);
  const netEarningsPiasters = completedBookings.reduce((sum, b) => sum + b.accountant_payout_piasters, 0);

  const totalWithdrawnPiasters = myPayouts
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount_piasters, 0);

  const availableBalancePiasters = Math.max(0, netEarningsPiasters - totalWithdrawnPiasters);

  // Local state for adding slot
  const [slotDate, setSlotDate] = useState('2026-11-05');
  const [slotStartTime, setSlotStartTime] = useState('11:00');
  const [slotEndTime, setSlotEndTime] = useState('12:00');

  // Payout request modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmountEgp, setPayoutAmountEgp] = useState(Math.floor(availableBalancePiasters / 100));
  const [bankName, setBankName] = useState('البنك الأهلي المصري (NBE)');
  const [iban, setIban] = useState('EG123456789012345678901234567');
  const [payoutMsg, setPayoutMsg] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'calendar' | 'services' | 'earnings' | 'reviews'>(
    activeSection === 'calendar' ? 'calendar' : activeSection === 'requests' ? 'requests' : activeSection === 'earnings' ? 'earnings' : activeSection === 'services_pricing' ? 'services' : activeSection === 'reviews' ? 'reviews' : 'overview'
  );

  React.useEffect(() => {
    if (activeSection === 'calendar') setActiveTab('calendar');
    else if (activeSection === 'requests') setActiveTab('requests');
    else if (activeSection === 'earnings' || activeSection === 'payouts') setActiveTab('earnings');
    else if (activeSection === 'services_pricing') setActiveTab('services');
    else if (activeSection === 'reviews') setActiveTab('reviews');
    else if (activeSection === 'overview') setActiveTab('overview');
  }, [activeSection]);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const startIso = new Date(`${slotDate}T${slotStartTime}:00Z`).toISOString();
    const endIso = new Date(`${slotDate}T${slotEndTime}:00Z`).toISOString();
    addAvailabilitySlot(startIso, endIso);
  };

  const handleRequestPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const piasters = payoutAmountEgp * 100;
    if (piasters > availableBalancePiasters) {
      setPayoutMsg('المبلغ المطلوب أكبر من رصيدك المتاح للسحب.');
      return;
    }
    requestPayout(piasters, bankName, iban);
    setShowPayoutModal(false);
    setPayoutMsg('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#142B43] via-[#1C3552] to-[#142B43] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-700/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-xs font-bold text-[#D6AE57] border border-[#D6AE57]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة المحاسب القانوني المعتمد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t.dashboard.welcome} {currentUser.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {myAccountantProfile?.title} • رخصة سجل المحاسبين: <span className="font-mono">{myAccountantProfile?.license_number}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPayoutModal(true)}
          disabled={availableBalancePiasters < 50000}
          className="px-5 py-3 rounded-2xl bg-[#D6AE57] hover:bg-[#c49d47] text-[#142B43] font-black text-xs shadow-lg transition shrink-0 disabled:opacity-50 cursor-pointer"
        >
          طلب سحب أرباح (EGP)
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">طلبات جديدة مدفوعة</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{newRequests.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">بانتظار قبولك وبدء الجلسة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">إجمالي الإيرادات (Gross)</span>
          <span className="text-xl sm:text-2xl font-black text-[#142B43] mt-1 block">
            {formatEGP(grossEarningsPiasters, language)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">قبل خصم عمولة المنصة 15%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">صافي مستحقاتك (85%)</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 block">
            {formatEGP(netEarningsPiasters, language)}
          </span>
          <span className="text-[11px] text-emerald-700 mt-1 block">
            المتاح للسحب: {formatEGP(availableBalancePiasters, language)}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">التقييم العام</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl font-black text-amber-500">
              {myAccountantProfile?.rating.toFixed(2) || '5.00'}
            </span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ({myAccountantProfile?.reviews_count || 0} تقييم موثق)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-4 text-xs font-bold text-slate-500">
        {[
          { id: 'overview', label: 'نظرة عامة والطلبات' },
          { id: 'requests', label: `طلبات الاستشارة (${newRequests.length})` },
          { id: 'calendar', label: `جدول المواعيد الشاغرة (${mySlots.filter((s) => !s.is_booked).length})` },
          { id: 'services', label: `الخدمات والأسعار (${myServices.length})` },
          { id: 'earnings', label: 'كشف الأرباح والتحويلات' },
          { id: 'reviews', label: `التقييمات (${myReviews.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 border-b-2 transition ${
              activeTab === tab.id
                ? 'border-[#142B43] text-[#142B43]'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview & Requests */}
      {(activeTab === 'overview' || activeTab === 'requests') && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#142B43]">طلبات الاستشارات المحاسبية</h2>

          {myBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              لا توجد طلبات واردة حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {myBookings.map((b) => {
                const client = profiles.find((p) => p.id === b.customer_id);
                const srv = services.find((s) => s.id === b.service_id);

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-[#D6AE57] transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={client?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={client?.full_name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#142B43]">{client?.full_name}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {t.statuses[b.status]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          الخدمة: <span className="font-semibold">{language === 'ar' ? srv?.name_ar : srv?.name_en}</span> • الموعد: {new Date(b.scheduled_at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                        </p>
                        {b.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                            "{b.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-start md:text-end">
                        <span className="text-[10px] text-slate-400 block">صافي مستحقك (85%)</span>
                        <span className="text-sm font-black text-emerald-600">
                          {formatEGP(b.accountant_payout_piasters, language)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status === 'paid' && (
                          <button
                            type="button"
                            onClick={() => acceptBooking(b.id)}
                            className="px-4 py-2 rounded-xl bg-[#239B76] hover:bg-[#1e8565] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            قبول الطلب
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onOpenRoom(b.id)}
                          className="px-4 py-2 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          فتح الجلسة والمحادثة
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Calendar & Availability Slots */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Slot Form */}
          <form
            onSubmit={handleAddSlot}
            className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
          >
            <h3 className="text-sm font-bold text-[#142B43]">إضافة موعد شاغر جديد للاستشارة</h3>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">التاريخ</label>
              <input
                type="date"
                required
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">وقت البدء</label>
                <input
                  type="time"
                  required
                  value={slotStartTime}
                  onChange={(e) => setSlotStartTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">وقت الانتهاء</label>
                <input
                  type="time"
                  required
                  value={slotEndTime}
                  onChange={(e) => setSlotEndTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#142B43] text-white text-xs font-bold shadow-xs hover:bg-[#1C3552] transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة الموعد للجدول</span>
            </button>
          </form>

          {/* Slots List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#142B43]">قائمة المواعيد المسجلة بجدولك</h3>
            {mySlots.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد مواعيد مسجلة حالياً.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mySlots.map((slot) => {
                  const d = new Date(slot.start_time);
                  return (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        slot.is_booked
                          ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-bold block">
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

                      <div className="flex items-center gap-2">
                        {slot.is_booked ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                            محجوز
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => deleteAvailabilitySlot(slot.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="حذف الموعد"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Services & Pricing */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#142B43]">خدماتك وأسعار الاستشارة المعتمدة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myServices.map((srv) => (
              <div key={srv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-[#142B43]">{srv.name_ar}</h3>
                  <span className="text-xs font-black text-[#142B43]">{formatEGP(srv.price_piasters, language)}</span>
                </div>
                <p className="text-[11px] text-slate-500">{srv.description_ar}</p>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                  <span>المدة: {srv.duration_minutes} دقيقة</span>
                  <span className="font-semibold text-emerald-700">
                    صافي مستحقك: {formatEGP(Math.round(srv.price_piasters * 0.85), language)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Earnings & Payouts */}
      {activeTab === 'earnings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#142B43]">سجل التحويلات البنكية للمستحقات</h2>
            <button
              type="button"
              onClick={() => setShowPayoutModal(true)}
              disabled={availableBalancePiasters < 50000}
              className="px-4 py-2 rounded-xl bg-[#142B43] text-white text-xs font-bold disabled:opacity-50"
            >
              طلب تحويل جديد
            </button>
          </div>

          {myPayouts.length === 0 ? (
            <p className="text-xs text-slate-400">لا توجد طلبات سحب سابقة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="p-3 text-start">المبلغ (EGP)</th>
                    <th className="p-3 text-start">البنك المحول إليه</th>
                    <th className="p-3 text-start">الحساب / IBAN</th>
                    <th className="p-3 text-start">الحالة</th>
                    <th className="p-3 text-start">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayouts.map((py) => (
                    <tr key={py.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#142B43]">{formatEGP(py.amount_piasters, language)}</td>
                      <td className="p-3">{py.bank_name}</td>
                      <td className="p-3 font-mono">{py.iban_or_account}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                          {py.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">
                        {new Date(py.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60">
          <form
            onSubmit={handleRequestPayoutSubmit}
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4"
          >
            <h3 className="text-sm font-bold text-[#142B43]">طلب تحويل مستحقات إلى الحساب البنكي</h3>
            {payoutMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg">{payoutMsg}</p>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">المبلغ المطلوب سحبه (EGP)</label>
              <input
                type="number"
                min={500}
                required
                value={payoutAmountEgp}
                onChange={(e) => setPayoutAmountEgp(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                الرصيد المتاح: {formatEGP(availableBalancePiasters, language)}
              </span>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">اسم البنك</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">رقم الآيبان (IBAN) أو الحساب</label>
              <input
                type="text"
                required
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-[#D6AE57]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#142B43] text-white text-xs font-bold"
              >
                تأكيد الطلب
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
