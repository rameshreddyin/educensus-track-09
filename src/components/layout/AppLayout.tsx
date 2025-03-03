
import React from 'react';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  compact?: boolean;
}

export const AppLayout = ({ children, title, subtitle, compact = false }: AppLayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <Header title={title} subtitle={subtitle} />
        <div className={`px-6 ${compact ? 'py-2' : 'py-4'} pb-16`}>
          {children}
        </div>
      </main>
    </div>
  );
};
