import { PageSection } from '../components/PageSection';

export function Models() {
  return (
    <div className="space-y-4">
      <PageSection
        title="Models"
        description="Mock list of available detection models and their status."
      >
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
            <div>
              <div className="text-text">YOLO Surface v1</div>
              <div className="text-[11px] text-muted-text">Default production</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-success">
                Loaded
              </span>
              <button
                type="button"
                className="rounded-md bg-accent-blue px-3 py-1.5 text-[11px] font-medium text-bg hover:bg-accent-blue/90"
              >
                Use
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
            <div>
              <div className="text-text">YOLO Surface v2</div>
              <div className="text-[11px] text-muted-text">
                Experimental · better fine scratches
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-muted-text">
                Not loaded
              </span>
              <button
                type="button"
                className="rounded-md bg-accent-blue px-3 py-1.5 text-[11px] font-medium text-bg hover:bg-accent-blue/90"
              >
                Load mock
              </button>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}

