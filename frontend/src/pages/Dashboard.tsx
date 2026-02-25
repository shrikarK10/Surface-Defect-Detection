import { PageSection } from '../components/PageSection';

export function Dashboard() {
  return (
    <div className="space-y-4">
      <PageSection
        title="Overview"
        description="High-level status of the surface inspection system."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-muted px-3 py-3">
            <div className="text-[11px] text-muted-text">Today&apos;s runs</div>
            <div className="mt-1 text-lg font-semibold text-text">24</div>
          </div>
          <div className="rounded-md bg-muted px-3 py-3">
            <div className="text-[11px] text-muted-text">Defect rate</div>
            <div className="mt-1 text-lg font-semibold text-accent-red">3.2%</div>
          </div>
          <div className="rounded-md bg-muted px-3 py-3">
            <div className="text-[11px] text-muted-text">Active model</div>
            <div className="mt-1 text-lg font-semibold text-success">
              YOLO Surface v1
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="Recent activity"
        description="Latest inference runs and dataset updates."
      >
        <div className="space-y-2 text-xs text-muted-text">
          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
            <span>Inference run · Line A · 32 images</span>
            <span className="text-[11px] text-success">Completed</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
            <span>Dataset sync · New scratches batch</span>
            <span className="text-[11px] text-accent-blue">Queued</span>
          </div>
        </div>
      </PageSection>
    </div>
  );
}

