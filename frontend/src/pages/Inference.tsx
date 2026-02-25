import { PageSection } from '../components/PageSection';

export function Inference() {
  return (
    <div className="space-y-4">
      <PageSection
        title="Run inference"
        description="Upload surface images and preview mock detections. Backend is not connected yet."
      >
        <div className="flex flex-col gap-3 text-xs text-muted-text md:flex-row">
          <div className="flex-1 space-y-2">
            <label className="block text-[11px] font-medium text-muted-text">
              Input images
            </label>
            <div className="flex items-center gap-2 rounded-md border border-dashed border-muted bg-muted px-3 py-4">
              <button
                type="button"
                className="rounded-md bg-accent-blue px-3 py-1.5 text-[11px] font-medium text-bg hover:bg-accent-blue/90"
              >
                Select files
              </button>
              <span>or drag &amp; drop here</span>
            </div>
          </div>
          <div className="w-full space-y-2 md:w-64">
            <label className="block text-[11px] font-medium text-muted-text">
              Model
            </label>
            <select className="w-full rounded-md border border-muted bg-muted px-2 py-1.5 text-xs text-text outline-none">
              <option>YOLO Surface v1</option>
              <option>YOLO Surface v2</option>
            </select>
            <button
              type="button"
              className="mt-3 w-full rounded-md bg-accent-blue px-3 py-1.5 text-[11px] font-medium text-bg hover:bg-accent-blue/90"
            >
              Run mock inference
            </button>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="Preview"
        description="Layout placeholder for prediction visualizations."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex h-48 items-center justify-center rounded-md bg-muted text-xs text-muted-text">
            Input image preview
          </div>
          <div className="flex h-48 items-center justify-center rounded-md bg-muted text-xs text-muted-text">
            Detection overlay preview
          </div>
        </div>
      </PageSection>
    </div>
  );
}

