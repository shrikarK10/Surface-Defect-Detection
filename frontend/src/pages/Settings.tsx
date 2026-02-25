import { PageSection } from '../components/PageSection';

export function Settings() {
  return (
    <div className="space-y-4">
      <PageSection
        title="Display settings"
        description="UI-only settings for the dashboard layout."
      >
        <div className="space-y-3 text-xs text-muted-text">
          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
            <div>
              <div className="text-text">Compact cards</div>
              <div className="text-[11px] text-muted-text">
                Reduce padding for dashboard widgets.
              </div>
            </div>
            <button
              type="button"
              className="rounded-full bg-panel px-3 py-1 text-[11px] font-medium text-muted-text hover:bg-panel/80"
            >
              Toggle
            </button>
          </div>

          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
            <div>
              <div className="text-text">High contrast mode</div>
              <div className="text-[11px] text-muted-text">
                Emphasize critical states and alerts.
              </div>
            </div>
            <button
              type="button"
              className="rounded-full bg-panel px-3 py-1 text-[11px] font-medium text-muted-text hover:bg-panel/80"
            >
              Toggle
            </button>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="Danger zone"
        description="Mock destructive actions for managing datasets and models."
      >
        <div className="space-y-2 text-xs text-muted-text">
          <button
            type="button"
            className="w-full rounded-md bg-accent-red px-3 py-2 text-[11px] font-medium text-bg hover:bg-accent-red/90"
          >
            Reset mock dashboard data
          </button>
          <p className="text-[11px] text-muted-text">
            These actions are placeholders only and do not affect any backend
            services in Phase 2.
          </p>
        </div>
      </PageSection>
    </div>
  );
}

