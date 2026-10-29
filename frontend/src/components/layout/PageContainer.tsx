import React from 'react';
import { AppSidebar } from './AppSidebar';
import { Topbar } from './Topbar';

interface PageContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#080C18] text-slate-100 cyber-grid">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
