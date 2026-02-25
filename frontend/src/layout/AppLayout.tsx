import type { ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import type { AppPage } from '../App';

interface AppLayoutProps {
  activePage: AppPage;
  onPageChange: (page: AppPage) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  children: ReactNode;
}

export function AppLayout({
  activePage,
  onPageChange,
  isDark,
  onToggleTheme,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-bg text-text">
      <Sidebar activePage={activePage} onPageChange={onPageChange} />
      <div className="flex flex-1 flex-col">
        <Topbar isDark={isDark} onToggleTheme={onToggleTheme} />
        <main className="flex-1 overflow-auto bg-bg px-6 py-4 md:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

