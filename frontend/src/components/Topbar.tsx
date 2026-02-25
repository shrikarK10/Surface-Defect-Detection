interface TopbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Topbar({ isDark, onToggleTheme }: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-muted bg-panel px-4 py-3 md:px-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-sm font-semibold text-text">Surface Defect Detection</h1>
        <p className="text-xs text-muted-text">
          Phase 2 · Frontend layout only
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-text hover:bg-muted/80"
        >
          v0.1
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-text hover:bg-muted/80"
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isDark ? 'bg-success' : 'bg-accent-blue'
            }`}
          />
          <span>{isDark ? 'Dark' : 'Light'} theme</span>
        </button>
      </div>
    </header>
  );
}

