import React, { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import { X, Calendar, Clock, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountantId: string;
  preselectedServiceId?: string;
  onProceedToPayment: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  accountantId,
  preselectedServiceId,
  onProceedToPayment,
}) => {
  const {
    language,
    profiles,
    accountantProfiles,
    services,
    slots,
    createBooking,
    platformSettings,
  } = useStore();

  const t = translations[language];

  const profile = profiles.find((p) => p.id === accountantId);
  const accountant = accountantProfiles.find((ap) => ap.profile_id === accountantId);

  const availableServices = services.filter((s) => s.accountant_id === accountantId && s.is_active);
  const availableSlots = slots.filter((s) => s.accountant_id === accountantId && !s.is_booked);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (availableServices[0]?.id ?? '')
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string>(availableSlots[0]?.id ?? '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    } else if (availableServices.length > 0 && !selectedServiceId) {
      setSelectedServiceId(availableServices[0].id);
    }

    if (availableSlots.length > 0 && !selectedSlotId) {
      setSelectedSlotId(availableSlots[0].id);
    }
  }, [preselectedServiceId, availableServices, availableSlots]);

  if (!isOpen || !profile || !accountant) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || availableServices[0];
  const currentSlot = slots.find((s) => s.id === selectedSlotId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedServiceId) {
      setError('يرجى اختيار الخدمة المطلوبة');
      return;
    }
    if (!selectedSlotId) {
      setError('يرجى اختيار موعد متاح للاستشارة');
      return;
    }

    const res = createBooking(accountantId, selectedServiceId, selectedSlotId, notes);
    if (!res.success || !res.bookingId) {
      setError(res.error || 'تعذر إنشاء الحجز');
      return;
    }

    onClose();
    onProceedToPayment(res.bookingId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-10 h-10 rounded-xl object-cover border border-[#D6AE57]"
            />
            <div>
              <h3 className="text-sm font-bold text-[#142B43]">{t.booking.modalTitle}</h3>
              <p className="text-xs text-slate-500">مع: {profile.full_name} ({accountant.title})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleCreate} className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Service Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#142B43] block">
              {t.booking.selectService}
            </label>
            <div className="space-y-2">
              {availableServices.map((srv) => (
                <label
                  key={srv.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedServiceId === srv.id
                      ? 'border-[#D6AE57] bg-amber-50/40 text-[#142B43]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="service"
                      value={srv.id}
                      checked={selectedServiceId === srv.id}
                      onChange={() => setSelectedServiceId(srv.id)}
                      className="accent-[#D6AE57]"
                    />
                    <div>
                      <span className="text-xs font-bold block">
                        {language === 'ar' ? srv.name_ar : srv.name_en}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {srv.duration_minutes} دقيقة
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#142B43]">
                    {formatEGP(srv.price_piasters, language)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Slot Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#142B43] block">
              {t.booking.selectSlot}
            </label>
            {availableSlots.length === 0 ? (
              <p className="text-xs text-rose-500 p-3 bg-rose-50 rounded-xl">
                {t.booking.noSlotsAvailable}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pe-1">
                {availableSlots.map((slot) => {
                  const d = new Date(slot.start_time);
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        isSelected
                          ? 'border-[#142B43] bg-[#142B43] text-white shadow-xs'
                          : 'border-slate-200 bg-white hover:border-[#D6AE57] text-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-bold">
                        {d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                          weekday: 'short',
                          month: 'numeric',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-[11px] opacity-80">
                        {d.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Inquiry Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#142B43] block">
              {t.booking.addNotes}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.booking.notesPlaceholder}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#D6AE57] focus:outline-none"
            />
          </div>

          {/* Transparent Summary */}
          {currentService && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>{t.booking.consultationFee}:</span>
                <span className="font-bold text-[#142B43]">
                  {formatEGP(currentService.price_piasters, language)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>عمولة المنصة ({Math.round(platformSettings.commission_rate * 100)}%):</span>
                <span>تُقتطع داخلياً من المحاسب</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#142B43]">
                <span>المبلغ الإجمالي للدفع:</span>
                <span className="text-[#142B43]">
                  {formatEGP(currentService.price_piasters, language)}
                </span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={availableSlots.length === 0}
            className="w-full py-3 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {t.booking.proceedToPayment}
          </button>
        </form>
      </div>
    </div>
  );
};
