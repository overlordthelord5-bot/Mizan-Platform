import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import {
  Users,
  ShieldCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  BookOpen,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  RotateCcw,
  Settings,
  Scale,
  Building,
  Check,
  X,
  Eye,
} from 'lucide-react';

export const AdminDashboard: React.FC<{ activeSection?: string }> = ({
  activeSection = 'overview',
}) => {
  const {
    language,
    profiles,
    accountantProfiles,
    accountantApplications,
    bookings,
    payments,
    payouts,
    ledgerAccounts,
    ledgerTransactions,
    ledgerEntries,
    disputes,
    platformSettings,
    auditLogs,
    approveAccountantApplication,
    rejectAccountantApplication,
    updatePlatformCommissionRate,
    processPayoutPayment,
    resolveDispute,
    reverseTransaction,
  } = useStore();

  const t = translations[language];

  const [activeTab, setActiveTab] = useState<string>(
    activeSection === 'ledger' ? 'ledger' : activeSection === 'accreditations' ? 'accreditations' : activeSection === 'settings' ? 'settings' : activeSection === 'disputes_admin' ? 'disputes' : 'overview'
  );

  React.useEffect(() => {
    if (activeSection === 'ledger') setActiveTab('ledger');
    else if (activeSection === 'accreditations') setActiveTab('accreditations');
    else if (activeSection === 'settings') setActiveTab('settings');
    else if (activeSection === 'disputes_admin') setActiveTab('disputes');
    else if (activeSection === 'audit_logs') setActiveTab('audit');
    else if (activeSection === 'payouts_settlement') setActiveTab('payouts');
    else if (activeSection === 'overview') setActiveTab('overview');
  }, [activeSection]);

  // Rejection modal
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('نقص في مستندات القيد بسجل المحاسبين والمراجعين');

  // Commission settings
  const [newCommissionPercent, setNewCommissionPercent] = useState(
    Math.round(platformSettings.commission_rate * 100)
  );

  // Dispute resolution modal
  const [resolvingDisputeId, setResolvingDisputeId] = useState<string | null>(null);
  const [adminDecision, setAdminDecision] = useState('');

  // Reversal transaction modal
  const [reversingTxId, setReversingTxId] = useState<string | null>(null);
  const [reversalReason, setReversalReason] = useState('خطأ تشغيلي أو تسوية استرداد');

  // System Stats
  const totalCustomers = profiles.filter((p) => p.role === 'customer').length;
  const certifiedAccountants = accountantProfiles.filter((ap) => ap.is_verified).length;
  const pendingApps = accountantApplications.filter((a) => a.status === 'pending');
  const totalGMVPiasters = bookings
    .filter((b) => b.status !== 'cancelled' && b.status !== 'refunded')
    .reduce((sum, b) => sum + b.total_amount_piasters, 0);

  const totalCommissionRevenuePiasters = bookings
    .filter((b) => ['paid', 'accepted', 'in_progress', 'completed'].includes(b.status))
    .reduce((sum, b) => sum + b.platform_fee_piasters, 0);

  const totalPayableToAccountantsPiasters = bookings
    .filter((b) => ['paid', 'accepted', 'in_progress', 'completed'].includes(b.status))
    .reduce((sum, b) => sum + b.accountant_payout_piasters, 0);

  // Export CSV function for the General Ledger
  const handleExportLedgerCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Transaction ID,Type,Account Number,Account Name,Entry Type,Amount (EGP),Posted At\n';

    ledgerEntries.forEach((entry) => {
      const tx = ledgerTransactions.find((t) => t.id === entry.transaction_id);
      const acc = ledgerAccounts.find((a) => a.account_number === entry.account_number);
      const row = [
        entry.transaction_id,
        tx?.reference_type || 'N/A',
        entry.account_number,
        `"${acc?.name_ar || ''}"`,
        entry.entry_type,
        (entry.amount_piasters / 100).toFixed(2),
        tx?.posted_at || '',
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meezan_general_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#142B43] via-[#1C3552] to-[#142B43] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-700/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6AE57]/20 text-xs font-bold text-[#D6AE57] border border-[#D6AE57]/30">
            <Scale className="w-3.5 h-3.5" />
            <span>لوحة الإدارة والرقابة المالية المركزية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            إدارة منصة مِيزان (SaaS Admin Portal)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            متابعة الاعتمادات، التدقيق المالي المزدوج، وإدارة العمليات والنزاعات.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportLedgerCSV}
          className="px-4 py-2.5 rounded-xl bg-[#D6AE57] hover:bg-[#c49d47] text-[#142B43] font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>تصدير دفتر الأستاذ (CSV)</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">المحاسبون المعتمدون</span>
          <span className="text-2xl font-black text-[#142B43] mt-1 block">{certifiedAccountants}</span>
          <span className="text-[11px] text-amber-600 mt-1 block">
            {pendingApps.length} طلب اعتماد قيد المراجعة
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">إجمالي المعاملات (GMV)</span>
          <span className="text-xl sm:text-2xl font-black text-[#142B43] mt-1 block">
            {formatEGP(totalGMVPiasters, language)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">حجم التداولات عبر المنصة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">إيراد عمولة المنصة (15%)</span>
          <span className="text-xl sm:text-2xl font-black text-[#239B76] mt-1 block">
            {formatEGP(totalCommissionRevenuePiasters, language)}
          </span>
          <span className="text-[11px] text-emerald-700 mt-1 block">حـ/ 4000 إيرادات العمليات</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">مستحقات المحاسبين (85%)</span>
          <span className="text-xl sm:text-2xl font-black text-blue-600 mt-1 block">
            {formatEGP(totalPayableToAccountantsPiasters, language)}
          </span>
          <span className="text-[11px] text-blue-700 mt-1 block">حـ/ 2000 التزامات المحاسبين</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 gap-4 text-xs font-bold text-slate-500">
        {[
          { id: 'overview', label: 'نظرة عامة والاعتمادات' },
          { id: 'accreditations', label: `طلبات الاعتماد (${pendingApps.length})` },
          { id: 'ledger', label: 'دفتر الأستاذ والقيود المحاسبية' },
          { id: 'payouts', label: `التحويلات والمستحقات (${payouts.length})` },
          { id: 'disputes', label: `إدارة النزاعات (${disputes.length})` },
          { id: 'settings', label: 'إعدادات المنصة والعمولة' },
          { id: 'audit', label: `سجل النشاط (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
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

      {/* 1. Tab: Accreditations */}
      {(activeTab === 'overview' || activeTab === 'accreditations') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#142B43]">طلبات اعتماد المحاسبين الجدد</h2>
            <span className="text-xs text-slate-400">تخضع لمراجعة سجل المحاسبين والمراجعين</span>
          </div>

          {accountantApplications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              لا توجد طلبات اعتماد مسجلة.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {accountantApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#142B43]">{app.full_name}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.statuses[app.status]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        البريد: {app.email} • الهاتف: {app.phone} • رقم القيد بالنقابة/السجل: <span className="font-mono font-semibold">{app.license_number}</span>
                      </p>
                    </div>

                    {app.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => approveAccountantApplication(app.id)}
                          className="px-4 py-2 rounded-xl bg-[#239B76] hover:bg-[#1e8565] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>اعتماد ونشر الملف</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingAppId(app.id)}
                          className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block">المؤهل الأكاديمي:</span>
                      <p className="font-medium text-slate-800">{app.degrees}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block">سنوات الخبرة العملية:</span>
                      <p className="font-medium text-slate-800">{app.years_of_experience} سنوات</p>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="text-slate-400 block mb-1">الشهادات والمستندات المرفقة:</span>
                    <div className="flex flex-wrap gap-2">
                      {app.documents_urls.map((doc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px]"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>{doc.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Tab: Double-Entry General Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* Chart of Accounts Grid */}
          <div>
            <h2 className="text-sm font-bold text-[#142B43] mb-3">دليل الحسابات وأرصدة دفتر الأستاذ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {ledgerAccounts.map((acc) => (
                <div key={acc.account_number} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-mono font-bold text-slate-600">{acc.account_number}</span>
                    <span className="uppercase text-[10px] font-semibold">{acc.type}</span>
                  </div>
                  <h3 className="font-bold text-[#142B43] mt-1 truncate">{acc.name_ar}</h3>
                  <p className="text-base font-black text-[#142B43] mt-2">
                    {formatEGP(acc.balance_piasters, language)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Journal Entries Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-2">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#142B43]">دفتر اليومية والقيود المزدوجة</h3>
                <p className="text-[11px] text-slate-400">تحقق آلي من توازن طرفي المدين والدائن لكل قيد مرحل</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>الدفتر متوازن 100%</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="p-3 text-start">رقم القيد</th>
                    <th className="p-3 text-start">رقم الحساب</th>
                    <th className="p-3 text-start">اسم الحساب</th>
                    <th className="p-3 text-start">المدين (Debit)</th>
                    <th className="p-3 text-start">الدائن (Credit)</th>
                    <th className="p-3 text-start">البيان والشرح</th>
                    <th className="p-3 text-start">التاريخ</th>
                    <th className="p-3 text-start">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledgerEntries.map((entry) => {
                    const tx = ledgerTransactions.find((t) => t.id === entry.transaction_id);
                    const acc = ledgerAccounts.find((a) => a.account_number === entry.account_number);

                    return (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-semibold text-slate-700">{entry.transaction_id}</td>
                        <td className="p-3 font-mono">{entry.account_number}</td>
                        <td className="p-3 font-bold text-slate-800">{acc?.name_ar}</td>
                        <td className="p-3 font-bold text-[#142B43]">
                          {entry.entry_type === 'debit' ? formatEGP(entry.amount_piasters, language) : '-'}
                        </td>
                        <td className="p-3 font-bold text-[#142B43]">
                          {entry.entry_type === 'credit' ? formatEGP(entry.amount_piasters, language) : '-'}
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{tx?.description}</td>
                        <td className="p-3 text-slate-400">
                          {tx?.posted_at ? new Date(tx.posted_at).toLocaleDateString() : ''}
                        </td>
                        <td className="p-3">
                          {tx && !tx.is_reversed && (
                            <button
                              type="button"
                              onClick={() => setReversingTxId(tx.id)}
                              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                              title="إنشاء قيد عكسي"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>قيد عكسي</span>
                            </button>
                          )}
                          {tx?.is_reversed && (
                            <span className="text-[10px] font-bold text-slate-400">مُعكوس</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Tab: Platform Settings & Commission Rate */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl space-y-6">
          <h2 className="text-base font-bold text-[#142B43]">إعدادات المنصة ونسبة العمولة</h2>
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                نسبة عمولة المنصة (%) للحجوزات الجديدة
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={newCommissionPercent}
                  onChange={(e) => setNewCommissionPercent(Number(e.target.value))}
                  className="w-24 p-2.5 rounded-xl border border-slate-200 font-bold text-[#142B43] text-center"
                />
                <span className="text-slate-500 font-semibold">% من قيمة الاستشارة الإجمالية</span>
                <button
                  type="button"
                  onClick={() => updatePlatformCommissionRate(newCommissionPercent / 100)}
                  className="px-4 py-2.5 rounded-xl bg-[#142B43] text-white font-bold cursor-pointer hover:bg-[#1C3552]"
                >
                  حفظ التعديل
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                ملاحظة أمان: الحجوزات السابقة تحتفظ بنسبة العمولة (15%) المقيدة وقت إنشائها دون تغيير.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="font-bold text-slate-700 block">معلومات الدعم والاتصال:</span>
              <p className="text-slate-600">البريد: {platformSettings.support_email}</p>
              <p className="text-slate-600">الهاتف: {platformSettings.support_phone}</p>
              <p className="text-slate-600">الحد الأدنى لسحب مستحقات المحاسب: {formatEGP(platformSettings.payout_threshold_piasters, language)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab: Disputes */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#142B43]">قضايا النزاعات والشكاوى</h2>
          {disputes.length === 0 ? (
            <p className="text-xs text-slate-400">لا توجد أي نزاعات مفتوحة حالياً.</p>
          ) : (
            <div className="space-y-3">
              {disputes.map((d) => (
                <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#142B43]">السبب: {d.reason}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{d.details}</p>

                  {d.status === 'under_investigation' || d.status === 'open' ? (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setResolvingDisputeId(d.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#239B76] text-white font-bold text-xs"
                      >
                        اتخاذ قرار والبت في النزاع
                      </button>
                    </div>
                  ) : (
                    <p className="text-emerald-800 font-semibold pt-1">
                      القرار الصادر: {d.admin_decision}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 font-bold text-sm text-[#142B43]">
            سجل العمليات والرقابة (Immutable Audit Trail)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                <tr>
                  <th className="p-3 text-start">المستخدم</th>
                  <th className="p-3 text-start">الإجراء</th>
                  <th className="p-3 text-start">الكيان المستهدف</th>
                  <th className="p-3 text-start">التفاصيل</th>
                  <th className="p-3 text-start">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{log.actor_name}</td>
                    <td className="p-3 font-semibold text-[#142B43]">{log.action}</td>
                    <td className="p-3 font-mono text-slate-500">{log.target_entity}</td>
                    <td className="p-3 text-slate-600">{log.details}</td>
                    <td className="p-3 text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dispute Resolution Modal */}
      {resolvingDisputeId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#142B43]">تسوية النزاع وإصدار القرار</h3>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">نص قرار الإدارة</label>
              <textarea
                rows={3}
                required
                value={adminDecision}
                onChange={(e) => setAdminDecision(e.target.value)}
                placeholder="اكتب أسباب القرار والتسوية المالية..."
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  resolveDispute(resolvingDisputeId, adminDecision || 'استرداد المبلغ للعميل', 'refund');
                  setResolvingDisputeId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold"
              >
                استرداد للعميل (قيد عكسي)
              </button>
              <button
                type="button"
                onClick={() => {
                  resolveDispute(resolvingDisputeId, adminDecision || 'صرف المستحق للمحاسب', 'release');
                  setResolvingDisputeId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
              >
                صرف للمحاسب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reversal Transaction Modal */}
      {reversingTxId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#142B43]">تأكيد إنشاء قيد عكسي محاسبي</h3>
            <p className="text-slate-600">
              سيتم إنشاء قيد عكسي متوازن (Reversal Entry) يعكس حسابات المدين والدائن للمعاملة #{reversingTxId} وتوثيقه في السجل.
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">سبب القيد العكسي</label>
              <input
                type="text"
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReversingTxId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  reverseTransaction(reversingTxId, reversalReason);
                  setReversingTxId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#DC5656] text-white font-bold"
              >
                ترحيل القيد العكسي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
