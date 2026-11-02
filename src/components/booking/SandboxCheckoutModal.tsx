import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Building,
} from 'lucide-react';

interface SandboxCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess: (bookingId: string) => void;
}

export const SandboxCheckoutModal: React.FC<SandboxCheckoutModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  onSuccess,
}) => {
  const {
    language,
    bookings,
    services,
    profiles,
    processSandboxPayment,
  } = useStore();

  const t = translations[language];

  const booking = bookings.find((b) => b.id === bookingId);
  const service = booking ? services.find((s) => s.id === booking.service_id) : null;
  const accountant = booking ? profiles.find((p) => p.id === booking.accountant_id) : null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'fawry' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardHolder, setCardHolder] = useState('عمر عبد العزيز');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen || !booking || !service) return null;

  const handleSimulatePayment = (isSuccess: boolean) => {
    setLoading(true);
    setFeedback(null);

    setTimeout(() => {
      setLoading(false);
      const res = processSandboxPayment(booking.id, paymentMethod, isSuccess);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'تم تأكيد الدفع التجريبي بنجاح وتوليد القيد المحاسبي المزدوج!',
        });
        setTimeout(() => {
          onSuccess(booking.id);
        }, 1200);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'فشلت عملية الدفع التجريبية',
        });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm font-bold text-[#142B43]">{t.checkout.title}</h3>
            </div>
            <p className="text-[11px] text-slate-500">
              رقم الحجز: <span className="font-mono font-semibold">{booking.booking_number}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Sandbox Notice Banner */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#D6AE57] shrink-0" />
            <div>
              <p className="font-bold">{t.checkout.sandboxBadge}</p>
              <p className="text-[11px] text-amber-800">
                هذه البيئة مخصصة للاختبار الوظيفي وتوليد القيود المحاسبية التلقائية.
              </p>
            </div>
          </div>

          {/* Transparent Accounting Breakdown */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>الخدمة المحاسبية:</span>
              <span className="font-bold text-[#142B43]">
                {language === 'ar' ? service.name_ar : service.name_en}
              </span>
            </div>
            {accountant && (
              <div className="flex items-center justify-between text-slate-600">
                <span>المحاسب المعتمد:</span>
                <span className="font-bold text-[#142B43]">{accountant.full_name}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-600">
              <span>قيمة الخدمة الأساسية:</span>
              <span className="font-bold text-[#142B43]">
                {formatEGP(booking.total_amount_piasters, language)}
              </span>
            </div>

            {/* Internal 15/85 breakdown */}
            <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px] text-slate-500">
              <div className="flex justify-between">
                <span>عمولة المنصة ({Math.round(booking.commission_rate * 100)}%):</span>
                <span>{formatEGP(booking.platform_fee_piasters, language)}</span>
              </div>
              <div className="flex justify-between">
                <span>مستحق المحاسب بعد الاستشارة (85%):</span>
                <span>{formatEGP(booking.accountant_payout_piasters, language)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-[#142B43]">
              <span>{t.checkout.totalToPay}:</span>
              <span className="text-base text-[#142B43]">
                {formatEGP(booking.total_amount_piasters, language)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">طريقة الدفع التجريبية</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                  paymentMethod === 'card'
                    ? 'border-[#142B43] bg-[#142B43] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>بطاقة بنكية</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('fawry')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                  paymentMethod === 'fawry'
                    ? 'border-[#142B43] bg-[#142B43] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>فوري Fawry</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                  paymentMethod === 'wallet'
                    ? 'border-[#142B43] bg-[#142B43] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>محفظة ذكية</span>
              </button>
            </div>
          </div>

          {/* Test Card Fields (Prefilled) */}
          {paymentMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">{t.checkout.cardNumber}</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 font-mono text-xs focus:border-[#D6AE57] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">{t.checkout.expiry}</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 font-mono text-xs focus:border-[#D6AE57] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t.checkout.cvv}</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 font-mono text-xs focus:border-[#D6AE57] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Feedback Alert */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Simulation Test Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSimulatePayment(true)}
              className="w-full py-3 rounded-xl bg-[#239B76] hover:bg-[#1e8565] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'جارٍ المعالجة والتسجيل...' : t.checkout.simulateSuccess}</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSimulatePayment(false)}
              className="w-full py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{t.checkout.simulateFailure}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
