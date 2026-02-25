import type { AppPage } from '../App';

const NAV_ITEMS: { id: AppPage; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inference', label: 'Inference' },
  { id: 'dataset', label: 'Dataset' },
  { id: 'models', label: 'Models' },
  { id: 'logs', label: 'Logs' },
  { id: 'settings', label: 'Settings' },
];

interface SidebarProps {
  activePage: AppPage;
  onPageChange: (page: AppPage) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="flex h-screen flex-col border-r border-muted bg-panel text-sm">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-text">
          Surface Defect
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activePage;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPageChange(item.id)}
              className={`flex w-full items-center rounded-md px-3 py-2 text-left transition-colors ${
                isActive
                  ? 'bg-accent-blue/20 text-accent-blue'
                  : 'text-muted-text hover:bg-muted hover:text-text'
              }`}
            >
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="border-t border-muted px-4 py-3 text-[11px] text-muted-text">
        v0.1 · Dark UI
      </div>
    </aside>
  );
}

