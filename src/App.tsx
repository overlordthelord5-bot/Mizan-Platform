/**
 * MEEZAN | مِيزان - B2C Accounting Consultation Marketplace
 * Main Application Orchestrator
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './lib/store';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/home/LandingPage';
import { AccountantDirectory } from './components/directory/AccountantDirectory';
import { AccountantProfileView } from './components/profile/AccountantProfileView';
import { ServicesCatalog } from './components/services/ServicesCatalog';
import { BookingModal } from './components/booking/BookingModal';
import { SandboxCheckoutModal } from './components/booking/SandboxCheckoutModal';
import { ConsultationRoomModal } from './components/consultation/ConsultationRoomModal';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { AccountantDashboard } from './components/dashboard/AccountantDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';

const AppContent: React.FC = () => {
  const { role } = useStore();

  // Navigation view state
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [searchParam, setSearchParam] = useState<string>('');

  // Modals & Active Selections
  const [selectedAccountantId, setSelectedAccountantId] = useState<string | null>(null);
  const [bookingAccountantId, setBookingAccountantId] = useState<string | null>(null);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [checkoutBookingId, setCheckoutBookingId] = useState<string | null>(null);
  const [consultationBookingId, setConsultationBookingId] = useState<string | null>(null);

  // Auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'apply_accountant'>('login');

  const handleOpenAuth = (tab: 'login' | 'register' | 'apply_accountant' = 'login') => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleNavigate = (view: string, search?: string) => {
    if (search !== undefined) {
      setSearchParam(search);
    }
    setSelectedAccountantId(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAccountant = (accountantId: string) => {
    setSelectedAccountantId(accountantId);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookAccountant = (accountantId: string, serviceId?: string) => {
    setBookingAccountantId(accountantId);
    setPreselectedServiceId(serviceId);
  };

  return (
    <AppLayout
      currentView={currentView}
      setCurrentView={handleNavigate}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      onOpenAuth={handleOpenAuth}
    >
      {/* 1. Home / Landing View */}
      {currentView === 'home' && (
        <LandingPage
          onSelectAccountant={handleSelectAccountant}
          onBookAccountant={(id) => handleBookAccountant(id)}
          onNavigate={handleNavigate}
        />
      )}

      {/* 2. Directory View */}
      {currentView === 'directory' && (
        <AccountantDirectory
          initialSearchQuery={searchParam}
          onSelectAccountant={handleSelectAccountant}
          onBookAccountant={(id) => handleBookAccountant(id)}
        />
      )}

      {/* 3. Accountant Profile View */}
      {currentView === 'profile' && selectedAccountantId && (
        <AccountantProfileView
          accountantId={selectedAccountantId}
          onBack={() => setCurrentView('directory')}
          onBook={(accId, srvId) => handleBookAccountant(accId, srvId)}
        />
      )}

      {/* 4. Services Catalog View */}
      {currentView === 'services' && (
        <ServicesCatalog
          onSelectService={(srvId, accId) => {
            if (accId) {
              handleBookAccountant(accId, srvId);
            } else {
              handleNavigate('directory');
            }
          }}
        />
      )}

      {/* 5. How It Works View */}
      {currentView === 'how-it-works' && (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-[#142B43]">كيف تعمل منصة مِيزان؟</h1>
            <p className="text-sm text-slate-500 mt-2">
              تجربة رقمية متكاملة مصممة لضمان سهولة الوصول إلى استشارة محاسبية وضريبية آمنة وموثوقة.
            </p>
          </div>
          <LandingPage
            onSelectAccountant={handleSelectAccountant}
            onBookAccountant={(id) => handleBookAccountant(id)}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      {/* 6. Dashboards (Role-Aware) */}
      {currentView === 'dashboard' && (
        <>
          {role === 'customer' && (
            <CustomerDashboard
              activeSection={activeSection}
              onOpenRoom={(bId) => setConsultationBookingId(bId)}
              onPayNow={(bId) => setCheckoutBookingId(bId)}
              onFindAccountant={() => handleNavigate('directory')}
            />
          )}

          {role === 'accountant' && (
            <AccountantDashboard
              activeSection={activeSection}
              onOpenRoom={(bId) => setConsultationBookingId(bId)}
            />
          )}

          {role === 'admin' && (
            <AdminDashboard activeSection={activeSection} />
          )}
        </>
      )}

      {/* Modals */}
      {bookingAccountantId && (
        <BookingModal
          isOpen={Boolean(bookingAccountantId)}
          onClose={() => setBookingAccountantId(null)}
          accountantId={bookingAccountantId}
          preselectedServiceId={preselectedServiceId}
          onProceedToPayment={(bookingId) => {
            setBookingAccountantId(null);
            setCheckoutBookingId(bookingId);
          }}
        />
      )}

      {checkoutBookingId && (
        <SandboxCheckoutModal
          isOpen={Boolean(checkoutBookingId)}
          onClose={() => setCheckoutBookingId(null)}
          bookingId={checkoutBookingId}
          onSuccess={(bookingId) => {
            setCheckoutBookingId(null);
            setConsultationBookingId(bookingId);
            setCurrentView('dashboard');
          }}
        />
      )}

      {consultationBookingId && (
        <ConsultationRoomModal
          isOpen={Boolean(consultationBookingId)}
          onClose={() => setConsultationBookingId(null)}
          bookingId={consultationBookingId}
        />
      )}

      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          defaultTab={authTab}
        />
      )}
    </AppLayout>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
