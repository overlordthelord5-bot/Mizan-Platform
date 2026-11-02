import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useStore } from '../../lib/store';

interface AppLayoutProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenAuth: (defaultTab?: 'login' | 'register' | 'apply_accountant') => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentView,
  setCurrentView,
  activeSection,
  setActiveSection,
  onOpenAuth,
  children,
}) => {
  const { language } = useStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Is this view a dashboard view where the sidebar should be prominent?
  const isDashboardView = currentView === 'dashboard';

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F5F7FA] text-[#172B3A] flex flex-col font-sans transition-all selection:bg-[#D6AE57]/25 selection:text-[#142B43]"
    >
      {/* 1. Global Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuth={onOpenAuth}
      />

      {/* 2. Middle Body: Optional Sidebar + Content */}
      <div className="flex-1 flex flex-row overflow-x-hidden">
        {/* Render Sidebar in Dashboard view OR can be toggled in all views */}
        {isDashboardView && (
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 3. Global Footer (shown on public and marketing views, or bottom of pages) */}
      {!isDashboardView && (
        <Footer onNavigate={(view) => setCurrentView(view)} />
      )}
    </div>
  );
};
