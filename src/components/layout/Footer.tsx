import React from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { Scale, ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { language } = useStore();
  const t = translations[language];

  return (
    <footer className="bg-[#142B43] text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C3552] flex items-center justify-center text-[#D6AE57] border border-[#D6AE57]/40 shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">مِيزان</span>
                <span className="text-xs font-semibold ms-2 px-1.5 py-0.5 rounded bg-[#D6AE57]/20 text-[#D6AE57] border border-[#D6AE57]/30">
                  MEEZAN
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              "{t.brand.subtitle}"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'المنصة المصرية الأولى المتخصصة في ربط الأفراد والمهنيين المستقلين بمحاسبين قانونيين معتمدين، بنظام مالي مزدوج القيد يضمن كامل الحقوق والشفافية.'
                : 'Egypt’s premier B2C marketplace connecting individuals and freelancers directly with certified public accountants with double-entry escrow security.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C3552] border border-slate-700 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#D6AE57]" />
              <span>
                {language === 'ar'
                  ? 'سجل محاسبين ومراجعين معتمد'
                  : 'Official Egyptian CPA Verification'}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === 'ar' ? 'روابط المنصة' : 'Platform'}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#D6AE57] transition"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('directory')}
                  className="hover:text-[#D6AE57] transition"
                >
                  {t.nav.accountants}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#D6AE57] transition"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#D6AE57] transition"
                >
                  {t.nav.dashboard}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#D6AE57] transition"
                >
                  {t.nav.howItWorks}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Specialties */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === 'ar' ? 'أبرز الاستشارات' : 'Consulting Fields'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>{language === 'ar' ? 'الاستشارات الضريبية وفحص الدخل' : 'Tax Audits & Disputes'}</li>
              <li>{language === 'ar' ? 'تقديم الإقرارات الإلكترونية' : 'Electronic Tax Returns'}</li>
              <li>{language === 'ar' ? 'محاسبة الأطباء والمهندسين والمهن الحرة' : 'Freelancer & Private Clinics'}</li>
              <li>{language === 'ar' ? 'التخطيط المالي والميزانيات الشخصية' : 'Personal Budgeting & Wealth'}</li>
              <li>{language === 'ar' ? 'مراجعة وتدقيق المستندات المالية' : 'Financial Document Review'}</li>
            </ul>
          </div>

          {/* Col 4: Contact & Regulation */}
          <div className="space-y-3 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === 'ar' ? 'التواصل والدعم' : 'Contact & Support'}
            </h3>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D6AE57]" />
              <span dir="ltr">+20 2 2456 7890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D6AE57]" />
              <span>support@meezan.eg</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D6AE57]" />
              <span>
                {language === 'ar'
                  ? 'التجمع الخامس، القاهرة، جمهورية مصر العربية'
                  : 'New Cairo, Cairo, Egypt'}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
              <p>
                {language === 'ar'
                  ? 'عمولة المنصة 15% | مستحقات المحاسب 85% | جميع المبالغ بالجنيه المصري EGP'
                  : '15% Platform Commission | 85% CPA Payout | All amounts in EGP'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} MEEZAN | مِيزان. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              {language === 'ar' ? 'نسخة تجريبية (Demo Prototype)' : 'Demo Prototype Environment'}
            </span>
            <span>EGP / ج.م</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
