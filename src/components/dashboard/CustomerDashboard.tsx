import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import { BookingStatus } from '../../types';
import {
  Calendar,
  MessageSquare,
  Layers,
  Star,
  Clock,
  ShieldAlert,
  CreditCard,
  FileText,
  UserCheck,
} from 'lucide-react';

interface CustomerDashboardProps {
  onOpenRoom: (bookingId: string) => void;
  onPayNow: (bookingId: string) => void;
  onFindAccountant: () => void;
  activeSection?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onOpenRoom,
  onPayNow,
  onFindAccountant,
  activeSection = 'overview',
}) => {
  const {
    currentUser,
    language,
    bookings,
    services,
    profiles,
    payments,
    disputes,
    favorites,
    accountantProfiles,
  } = useStore();

  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'payments' | 'disputes' | 'favorites'>('overview');

  React.useEffect(() => {
    if (activeSection === 'bookings') setActiveTab('bookings');
    else if (activeSection === 'payments') setActiveTab('payments');
    else if (activeSection === 'disputes') setActiveTab('disputes');
    else if (activeSection === 'favorites') setActiveTab('favorites');
    else if (activeSection === 'overview') setActiveTab('overview');
  }, [activeSection]);

  const myBookings = bookings.filter((b) => b.customer_id === currentUser.id);
  const myPayments = payments.filter((p) => p.customer_id === currentUser.id);
  const myDisputes = disputes.filter((d) => d.opened_by_id === currentUser.id);

  const activeCount = myBookings.filter((b) => ['paid', 'accepted', 'in_progress'].includes(b.status)).length;
  const completedCount = myBookings.filter((b) => b.status === 'completed').length;
  const totalPaidPiasters = myPayments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount_piasters, 0);

  const statusColors: Record<BookingStatus, string> = {
    requested: 'bg-slate-100 text-slate-700',
    awaiting_payment: 'bg-amber-100 text-amber-800',
    paid: 'bg-blue-100 text-blue-800',
    accepted: 'bg-indigo-100 text-indigo-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-rose-100 text-rose-800',
    disputed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-[#142B43] to-[#1C3552] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D6AE57] border border-white/10">
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'لوحة تحكم العميل الشخصية' : 'Customer Personal Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t.dashboard.welcome} {currentUser.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {language === 'ar'
              ? 'إدارة استشاراتك المحاسبية والضريبية ومتابعة المحادثات والملفات المالية بكل سهولة.'
              : 'Manage your tax sessions, live consultations, and financial documents with ease.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onFindAccountant}
          className="px-5 py-3 rounded-2xl bg-[#D6AE57] hover:bg-[#c49d47] text-[#142B43] font-black text-xs shadow-lg transition shrink-0 cursor-pointer"
        >
          {language === 'ar' ? 'حجز استشارة جديدة +' : 'Book Consultation +'}
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">{language === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}</span>
          <span className="text-2xl font-black text-[#142B43] mt-1 block">{myBookings.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">{language === 'ar' ? 'كل الجلسات المحاسبية' : 'All consultation sessions'}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">{language === 'ar' ? 'الحجوزات النشطة' : 'Active Bookings'}</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{activeCount}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">{language === 'ar' ? 'قيد الانتظار أو جارية الآن' : 'In progress or pending'}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">{language === 'ar' ? 'الاستشارات المكتملة' : 'Completed'}</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedCount}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">{language === 'ar' ? 'تمت بنجاح وتوثيق' : 'Completed & documented'}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">{language === 'ar' ? 'إجمالي المدفوعات (EGP)' : 'Total Paid (EGP)'}</span>
          <span className="text-xl sm:text-2xl font-black text-[#142B43] mt-1 block">
            {formatEGP(totalPaidPiasters, language)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">{language === 'ar' ? 'مدفوعة في بيئة تجريبية' : 'Paid in sandbox'}</span>
        </div>
      </div>

      {/* Dashboard Sub-navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-4 text-xs font-bold text-slate-500">
        {[
          { id: 'overview', label: t.dashboard.overview },
          { id: 'bookings', label: `${t.dashboard.myBookings} (${myBookings.length})` },
          { id: 'payments', label: language === 'ar' ? `سجل المدفوعات (${myPayments.length})` : `Payments (${myPayments.length})` },
          { id: 'disputes', label: language === 'ar' ? `الشكاوى والنزاعات (${myDisputes.length})` : `Disputes (${myDisputes.length})` },
          { id: 'favorites', label: language === 'ar' ? `المحاسبون المفضلون (${favorites.length})` : `Favorites (${favorites.length})` },
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

      {/* Tab: Overview & Bookings */}
      {(activeTab === 'overview' || activeTab === 'bookings') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#142B43]">{t.dashboard.myBookings}</h2>
          </div>

          {myBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#142B43]">
                {language === 'ar' ? 'لا توجد حجوزات استشارة حالياً' : 'No bookings yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'ar'
                  ? 'تصفح قائمة المحاسبين المعتمدين واختر الخدمة الأنسب لاستشارتك.'
                  : 'Browse certified accountants and book your first session.'}
              </p>
              <button
                type="button"
                onClick={onFindAccountant}
                className="px-4 py-2 rounded-xl bg-[#142B43] text-white text-xs font-bold cursor-pointer"
              >
                {t.home.findAccountantBtn}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {myBookings.map((b) => {
                const srv = services.find((s) => s.id === b.service_id);
                const acc = profiles.find((p) => p.id === b.accountant_id);

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-[#D6AE57] transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {acc?.avatar_url && (
                        <img
                          src={acc.avatar_url}
                          alt={acc.full_name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#142B43]">
                            {srv ? (language === 'ar' ? srv.name_ar : srv.name_en) : 'استشارة'}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[b.status]}`}
                          >
                            {t.statuses[b.status]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {language === 'ar' ? 'المحاسب:' : 'CPA:'} <span className="font-semibold text-slate-700">{acc?.full_name}</span> | {new Date(b.scheduled_at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          #{b.booking_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-start md:text-end">
                        <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'المبلغ' : 'Amount'}</span>
                        <span className="text-sm font-black text-[#142B43]">
                          {formatEGP(b.total_amount_piasters, language)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status === 'awaiting_payment' ? (
                          <button
                            type="button"
                            onClick={() => onPayNow(b.id)}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            {language === 'ar' ? 'سداد الآن (Sandbox)' : 'Pay Now'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenRoom(b.id)}
                            className="px-4 py-2 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#D6AE57]" />
                            <span>{language === 'ar' ? 'دخول الاستشارة والمستندات' : 'Open Session & Files'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Payments */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 font-bold text-sm text-[#142B43]">
            {language === 'ar' ? 'سجل العمليات المالية والمدفوعات الإلكترونية التجريبية' : 'Sandbox Electronic Payments Ledger'}
          </div>
          {myPayments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              {language === 'ar' ? 'لا توجد مدفوعات مسجلة بعد.' : 'No recorded payments.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="p-3 text-start">رقم المعاملة</th>
                    <th className="p-3 text-start">الحجز المرتبط</th>
                    <th className="p-3 text-start">طريقة الدفع</th>
                    <th className="p-3 text-start">المبلغ (EGP)</th>
                    <th className="p-3 text-start">الحالة</th>
                    <th className="p-3 text-start">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayments.map((p) => {
                    const bk = bookings.find((b) => b.id === p.booking_id);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-semibold text-slate-700">{p.transaction_id}</td>
                        <td className="p-3">{bk?.booking_number || p.booking_id}</td>
                        <td className="p-3 capitalize">{p.payment_method}</td>
                        <td className="p-3 font-bold text-[#142B43]">{formatEGP(p.amount_piasters, language)}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              p.status === 'success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.status === 'success' ? 'ناجحة' : 'فاشلة'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {new Date(p.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Disputes */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#142B43]">
            {language === 'ar' ? 'قائمة الشكاوى والمنازعات المفتوحة' : 'Disputes & Complaints'}
          </h2>
          {myDisputes.length === 0 ? (
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'لا توجد أي شكاوى أو نزاعات مفتوحة بحسابك.' : 'No open disputes.'}
            </p>
          ) : (
            <div className="space-y-3">
              {myDisputes.map((d) => (
                <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#142B43]">{d.reason}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{d.details}</p>
                  {d.admin_decision && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold">
                      قرار الإدارة: {d.admin_decision}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Favorites */}
      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((accId) => {
            const acc = profiles.find((p) => p.id === accId);
            const accProfile = accountantProfiles.find((ap) => ap.profile_id === accId);
            if (!acc || !accProfile) return null;

            return (
              <div key={accId} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={acc.avatar_url} alt={acc.full_name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-[#142B43]">{acc.full_name}</h3>
                    <p className="text-xs text-slate-500">{accProfile.title}</p>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      {accProfile.rating.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onFindAccountant}
                  className="px-3 py-1.5 rounded-xl bg-[#142B43] text-white text-xs font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'حجز جلسة' : 'Book Session'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
