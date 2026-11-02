import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { UserRole } from '../../types';
import {
  Scale,
  Globe,
  Bell,
  Menu,
  X,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: (defaultTab?: 'login' | 'register' | 'apply_accountant') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onOpenAuth }) => {
  const {
    role,
    setRole,
    currentUser,
    language,
    setLanguage,
    notifications,
    markNotificationsRead,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const t = translations[language];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const roleLabels: Record<UserRole, { ar: string; en: string; color: string }> = {
    customer: { ar: 'عميل (فرد)', en: 'Customer (Individual)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    accountant: { ar: 'محاسب معتمد', en: 'Certified Accountant', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    admin: { ar: 'مدير المنصة', en: 'Platform Admin', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  };

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'directory', label: t.nav.accountants },
    { id: 'services', label: t.nav.services },
    { id: 'how-it-works', label: t.nav.howItWorks },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Demo Context Banner */}
      <div className="bg-[#142B43] text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#239B76] animate-pulse"></span>
            <span className="font-medium text-slate-200">
              {language === 'ar'
                ? 'بيئة تجريبية تفاعلية بالكامل (Interactive High-Fidelity Prototype)'
                : 'Fully Interactive Prototype & Double-Entry Financial Engine'}
            </span>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 hidden sm:inline">{t.nav.switchRole}</span>
            <div className="inline-flex rounded-md p-0.5 bg-[#1C3552] border border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`px-2.5 py-0.5 rounded transition ${
                  role === 'customer'
                    ? 'bg-[#D6AE57] text-[#142B43] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'العميل' : 'Customer'}
              </button>
              <button
                type="button"
                onClick={() => setRole('accountant')}
                className={`px-2.5 py-0.5 rounded transition ${
                  role === 'accountant'
                    ? 'bg-[#D6AE57] text-[#142B43] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'المحاسب' : 'Accountant'}
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`px-2.5 py-0.5 rounded transition ${
                  role === 'admin'
                    ? 'bg-[#D6AE57] text-[#142B43] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'الإدارة' : 'Admin'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 group text-start focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#142B43] to-[#1C3552] flex items-center justify-center text-[#D6AE57] shadow-md border border-[#D6AE57]/30 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#142B43]">مِيزان</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#D6AE57]/15 text-[#142B43] border border-[#D6AE57]/30">
                  MEEZAN
                </span>
              </div>
              <p className="text-[11px] text-[#758394] font-medium hidden sm:block">
                {t.brand.subtitle}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => setCurrentView(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === link.id
                    ? 'text-[#142B43] bg-slate-100 font-semibold'
                    : 'text-[#172B3A] hover:text-[#142B43] hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Dashboard Link */}
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                currentView === 'dashboard'
                  ? 'text-[#142B43] bg-[#D6AE57]/15 font-semibold text-[#142B43]'
                  : 'text-[#172B3A] hover:text-[#142B43] hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-[#D6AE57]" />
              {t.nav.dashboard}
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition border border-slate-200"
              title="Toggle Language / تبديل اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-[#142B43]" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markNotificationsRead();
                }}
                className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[#142B43]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 end-1 w-4 h-4 rounded-full bg-[#DC5656] text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute end-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-[#142B43]">
                      {language === 'ar' ? 'مركز الإشعارات' : 'Notifications'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {notifications.length} {language === 'ar' ? 'إشعار' : 'items'}
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition hover:bg-slate-50 ${
                          !n.is_read ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-[#142B43] mb-1">
                          <span>{language === 'ar' ? n.title_ar : n.title_en}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(n.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {language === 'ar' ? n.message_ar : n.message_en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition focus:outline-none"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.full_name}
                  className="w-7 h-7 rounded-full object-cover border border-[#D6AE57]"
                />
                <div className="text-start hidden sm:block">
                  <p className="text-xs font-bold text-[#142B43] leading-tight truncate max-w-[110px]">
                    {currentUser.full_name}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-semibold px-1 rounded border ${roleLabels[role].color}`}
                  >
                    {language === 'ar' ? roleLabels[role].ar : roleLabels[role].en}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showRoleMenu && (
                <div className="absolute end-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#142B43]">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <div className="mt-1 text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'ar' ? 'الحساب نشط ومعتمد' : 'Active Account'}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('dashboard');
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-start px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      {t.nav.dashboard}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAuth('apply_accountant');
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-start px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      {t.nav.joinAsAccountant}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 md:hidden transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                setCurrentView(link.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-start px-3 py-2 rounded-md text-sm font-medium text-[#172B3A] hover:bg-slate-100"
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setCurrentView('dashboard');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-start px-3 py-2 rounded-md text-sm font-semibold text-[#142B43] bg-amber-50/70"
          >
            {t.nav.dashboard}
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onOpenAuth('apply_accountant');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-2 rounded-lg bg-[#142B43] text-[#D6AE57] text-xs font-bold"
            >
              {t.nav.joinAsAccountant}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
