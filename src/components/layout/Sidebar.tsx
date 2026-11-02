import React from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { UserRole } from '../../types';
import { formatEGP } from '../../lib/accounting';
import {
  Scale,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  FileText,
  CreditCard,
  Star,
  ShieldAlert,
  Users,
  BookOpen,
  DollarSign,
  Briefcase,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Globe,
  LogOut,
  FolderOpen,
  Send,
  Building,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  activeSection,
  setActiveSection,
  isCollapsed,
  setIsCollapsed,
}) => {
  const {
    role,
    setRole,
    currentUser,
    language,
    setLanguage,
    bookings,
    accountantApplications,
    disputes,
    resetDemoData,
  } = useStore();

  const t = translations[language];

  // Badges
  const pendingAppsCount = accountantApplications.filter((a) => a.status === 'pending').length;
  const newRequestsCount = bookings.filter((b) => b.accountant_id === currentUser.id && b.status === 'paid').length;
  const activeBookingsCount = bookings.filter((b) => b.customer_id === currentUser.id && ['paid', 'accepted', 'in_progress'].includes(b.status)).length;
  const openDisputesCount = disputes.filter((d) => d.status === 'open' || d.status === 'under_investigation').length;

  // Role Navigation Items
  const customerNavItems = [
    { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: language === 'ar' ? 'حجوزاتي' : 'My Bookings', icon: Calendar, badge: activeBookingsCount > 0 ? activeBookingsCount : undefined },
    { id: 'conversations', label: language === 'ar' ? 'المحادثات والمستندات' : 'Chats & Docs', icon: MessageSquare },
    { id: 'favorites', label: language === 'ar' ? 'المحاسبون المفضلون' : 'Favorite CPAs', icon: Star },
    { id: 'payments', label: language === 'ar' ? 'سجل المدفوعات' : 'Payments', icon: CreditCard },
    { id: 'disputes', label: language === 'ar' ? 'الشكاوى والنزاعات' : 'Disputes', icon: ShieldAlert },
    { id: 'directory', label: language === 'ar' ? 'دليل المحاسبين' : 'Find CPA', icon: Users, isExternalView: true },
    { id: 'services', label: language === 'ar' ? 'الخدمات المحاسبية' : 'Services', icon: Briefcase, isExternalView: true },
  ];

  const accountantNavItems = [
    { id: 'overview', label: language === 'ar' ? 'لوحة المحاسب' : 'Accountant Hub', icon: LayoutDashboard },
    { id: 'requests', label: language === 'ar' ? 'طلبات الاستشارة' : 'Requests', icon: Clock, badge: newRequestsCount > 0 ? newRequestsCount : undefined, badgeColor: 'bg-emerald-500' },
    { id: 'calendar', label: language === 'ar' ? 'جدول المواعيد الشاغرة' : 'Slots & Calendar', icon: Calendar },
    { id: 'services_pricing', label: language === 'ar' ? 'الخدمات والأسعار' : 'Services & Rates', icon: Briefcase },
    { id: 'conversations', label: language === 'ar' ? 'المحادثات والمستندات' : 'Client Sessions', icon: MessageSquare },
    { id: 'earnings', label: language === 'ar' ? 'الأرباح والمستحقات (85%)' : 'Earnings (85%)', icon: DollarSign },
    { id: 'payouts', label: language === 'ar' ? 'التحويلات البنكية' : 'Bank Payouts', icon: Building },
    { id: 'reviews', label: language === 'ar' ? 'تقييمات العملاء' : 'Reviews', icon: Star },
    { id: 'profile', label: language === 'ar' ? 'الملف المهني والشهادات' : 'CPA Profile', icon: ShieldCheck },
  ];

  const adminNavItems = [
    { id: 'overview', label: language === 'ar' ? 'نظرة عامة والتقارير' : 'Admin Overview', icon: LayoutDashboard },
    { id: 'accreditations', label: language === 'ar' ? 'طلبات الاعتماد' : 'Accreditations', icon: ShieldCheck, badge: pendingAppsCount > 0 ? pendingAppsCount : undefined, badgeColor: 'bg-amber-500' },
    { id: 'bookings', label: language === 'ar' ? 'جميع الحجوزات' : 'All Bookings', icon: Calendar },
    { id: 'ledger', label: language === 'ar' ? 'دفتر الأستاذ والقيود' : 'General Ledger', icon: BookOpen },
    { id: 'payouts_settlement', label: language === 'ar' ? 'مستحقات المحاسبين' : 'CPA Payouts', icon: DollarSign },
    { id: 'disputes_admin', label: language === 'ar' ? 'إدارة النزاعات' : 'Dispute Manager', icon: ShieldAlert, badge: openDisputesCount > 0 ? openDisputesCount : undefined, badgeColor: 'bg-rose-500' },
    { id: 'users', label: language === 'ar' ? 'المستخدمون والعملاء' : 'Users & CPAs', icon: Users },
    { id: 'settings', label: language === 'ar' ? 'إعدادات العمولة والمنصة' : 'Settings (15%)', icon: Settings },
    { id: 'audit_logs', label: language === 'ar' ? 'سجل العمليات (Audit)' : 'Audit Logs', icon: FileText },
  ];

  const navItems = role === 'admin' ? adminNavItems : role === 'accountant' ? accountantNavItems : customerNavItems;

  const roleMeta = {
    customer: { labelAr: 'حساب عميل (فرد)', labelEn: 'Customer Account', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    accountant: { labelAr: 'محاسب قانوني معتمد', labelEn: 'Certified CPA', color: 'bg-amber-50 text-amber-900 border-amber-300' },
    admin: { labelAr: 'إدارة المنصة الموحدة', labelEn: 'Super Admin', color: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
  };

  return (
    <aside
      className={`bg-[#142B43] text-white flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 border-e border-[#1C3552] z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64 sm:w-72'
      }`}
      aria-label="Sidebar Navigation"
    >
      {/* Top Header & Logo */}
      <div className="p-4 border-b border-[#1C3552]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-3 group text-start focus:outline-none transition ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C3552] to-[#142B43] flex items-center justify-center text-[#D6AE57] shadow-md border border-[#D6AE57]/40 shrink-0 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white">مِيزان</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D6AE57]/20 text-[#D6AE57] border border-[#D6AE57]/30">
                    MEEZAN
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium truncate">
                  {roleMeta[role][language === 'ar' ? 'labelAr' : 'labelEn']}
                </p>
              </div>
            )}
          </button>

          {/* Collapse / Expand Toggle Button */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C3552] transition focus:outline-none"
              title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
              aria-label="Toggle sidebar width"
            >
              {language === 'ar' ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Expand toggle when collapsed */}
        {isCollapsed && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1C3552] transition"
              title="توسيع القائمة"
            >
              {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          {!isCollapsed ? (language === 'ar' ? 'أقسام لوحة التحكم' : 'Navigation') : '•••'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeSection === item.id && currentView === 'dashboard';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.isExternalView) {
                  setCurrentView(item.id);
                } else {
                  setCurrentView('dashboard');
                  setActiveSection(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group text-start relative ${
                isSelected
                  ? 'bg-gradient-to-r from-[#1C3552] to-[#1C3552]/80 text-[#D6AE57] font-bold shadow-xs border border-[#D6AE57]/30'
                  : 'text-slate-300 hover:text-white hover:bg-[#1C3552]/60'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={item.label}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isSelected ? 'text-[#D6AE57]' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {/* Counter Badge */}
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full text-white shrink-0 ${
                    item.badgeColor || 'bg-[#D6AE57] text-[#142B43]'
                  } ${isCollapsed ? 'absolute -top-1 -end-1 w-4 h-4 p-0 flex items-center justify-center text-[9px]' : ''}`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active Golden Bar indicator for RTL & LTR */}
              {isSelected && (
                <span
                  className={`absolute top-2 bottom-2 w-1 bg-[#D6AE57] rounded-full ${
                    language === 'ar' ? 'end-1' : 'start-1'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom User Profile & Utility Panel */}
      <div className="p-3 border-t border-[#1C3552] space-y-2 bg-[#102337]/70">
        {/* User Card */}
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-[#1C3552]/50 border border-slate-700/50 ${
            isCollapsed ? 'justify-center p-1.5' : ''
          }`}
        >
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser.full_name}
            className="w-9 h-9 rounded-xl object-cover border border-[#D6AE57] shrink-0"
          />

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {currentUser.full_name}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {currentUser.email}
              </p>
            </div>
          )}
        </div>

        {/* Role Switcher Toolbar */}
        {!isCollapsed && (
          <div className="pt-2">
            <span className="text-[10px] font-semibold text-slate-400 block mb-1">
              {language === 'ar' ? 'تبديل الدور (تجريبي):' : 'Demo Role Switch:'}
            </span>
            <div className="grid grid-cols-3 gap-1 bg-[#142B43] p-1 rounded-lg border border-slate-700/80 text-[10px]">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-1 rounded text-center font-bold transition ${
                  role === 'customer'
                    ? 'bg-[#D6AE57] text-[#142B43] shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'عميل' : 'Client'}
              </button>
              <button
                type="button"
                onClick={() => setRole('accountant')}
                className={`py-1 rounded text-center font-bold transition ${
                  role === 'accountant'
                    ? 'bg-[#D6AE57] text-[#142B43] shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'محاسب' : 'CPA'}
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-1 rounded text-center font-bold transition ${
                  role === 'admin'
                    ? 'bg-[#D6AE57] text-[#142B43] shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'إدارة' : 'Admin'}
              </button>
            </div>
          </div>
        )}

        {/* Quick Utility Tools: Language & Reset */}
        <div className={`flex items-center gap-1.5 pt-1 ${isCollapsed ? 'flex-col' : 'justify-between'}`}>
          <button
            type="button"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#1C3552] hover:bg-[#254467] text-slate-300 hover:text-white text-[11px] font-semibold transition border border-slate-700"
            title="تبديل اللغة / Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#D6AE57]" />
            {!isCollapsed && <span>{language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>}
          </button>

          <button
            type="button"
            onClick={resetDemoData}
            className="p-1.5 rounded-lg bg-[#1C3552] hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 text-xs transition border border-slate-700"
            title={language === 'ar' ? 'إعادة ضبط البيانات التجريبية' : 'Reset Demo Data'}
            aria-label="Reset Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
