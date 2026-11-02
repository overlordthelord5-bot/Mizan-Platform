import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Award,
  Upload,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'apply_accountant';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { language, setRole } = useStore();
  const t = translations[language];

  const [tab, setTab] = useState<'login' | 'register' | 'apply_accountant'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experience, setExperience] = useState('5');
  const [bio, setBio] = useState('');
  const [degrees, setDegrees] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('تم تسجيل الدخول بنجاح!');
    setTimeout(() => {
      onClose();
      setSuccessMessage('');
    }, 800);
  };

  const handleApplyAccountantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('تم إرسال طلب اعتمادك بنجاح! سيتم مراجعة أوراقك من قِبل إدارة مِيزان وسجل المحاسبين.');
    setTimeout(() => {
      onClose();
      setSuccessMessage('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#142B43] text-[#D6AE57] flex items-center justify-center font-bold text-xs">
              M
            </div>
            <h3 className="text-sm font-bold text-[#142B43]">
              {tab === 'login' ? 'تسجيل الدخول إلى مِيزان' : tab === 'register' ? 'إنشاء حساب جديد' : 'طلب اعتماد محاسب قانوني'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-3 border-b-2 transition ${
              tab === 'login' ? 'border-[#142B43] text-[#142B43]' : 'border-transparent hover:text-slate-700'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-3 border-b-2 transition ${
              tab === 'register' ? 'border-[#142B43] text-[#142B43]' : 'border-transparent hover:text-slate-700'
            }`}
          >
            حساب عميل (فرد)
          </button>
          <button
            type="button"
            onClick={() => setTab('apply_accountant')}
            className={`flex-1 py-3 border-b-2 transition ${
              tab === 'apply_accountant' ? 'border-[#D6AE57] text-[#142B43] bg-amber-50/50' : 'border-transparent hover:text-slate-700'
            }`}
          >
            انضم كمحاسب معتمد
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                💡 <span className="font-semibold text-slate-700">ملاحظة تجريبية:</span> يمكنك في أي لحظة استخدام مبدّل الأدوار (Demo Role Switcher) في الشريط العلوي للتنقل المباشر بين العميل والمحاسب والإدارة!
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد أحمد الشريف"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mohamed@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">رقم الهاتف المصري</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                إنشاء حساب العميل
              </button>
            </form>
          )}

          {tab === 'apply_accountant' && (
            <form onSubmit={handleApplyAccountantSubmit} className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D6AE57] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  يخضع كل محاسب للتحقق من رقم القيد بسجل المحاسبين والمراجعين واعتماد الإدارة قبل نشر ملفه وظهوره للعملاء.
                </p>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">الاسم الثلاثي واللقب المهني</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أ. هاني عبد السلام - محاسب قانوني"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">رقم القيد بسجل المحاسبين</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="EGY-CPA-99881"
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">سنوات الخبرة</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">المؤهل الأكاديمي والشهادات</label>
                <input
                  type="text"
                  required
                  value={degrees}
                  onChange={(e) => setDegrees(e.target.value)}
                  placeholder="بكالوريوس تجارة شعبة محاسبة - جامعة عين شمس"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">نبذة عن خبرتك وتخصصك</label>
                <textarea
                  rows={2}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="اكتب نبذة عن تخصصاتك في الضرائب أو المحاسبة..."
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="p-3 border border-dashed border-slate-300 rounded-xl text-center text-slate-500">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="text-[11px] block font-semibold">إرفاق شهادة القيد والبطاقة الضريبية</span>
                <span className="text-[10px] text-slate-400">PDF, JPG حتى 10MB</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                تقديم طلب الانضمام والاعتماد
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
