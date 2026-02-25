import { PageSection } from '../components/PageSection';

export function Logs() {
  return (
    <div className="space-y-4">
      <PageSection
        title="System logs"
        description="Structured logging stream placeholder for inference and model events."
      >
        <div className="h-64 overflow-auto rounded-md bg-muted px-3 py-2 text-[11px] font-mono text-muted-text">
          <div className="text-success">
            12:01:23.123 INFO inference_completed line=A images=32
          </div>
          <div className="text-muted-text">
            12:03:09.884 INFO model_load_toggled name=surface-yolo-v2 loaded=true
          </div>
          <div className="text-accent-red">
            12:04:55.231 WARN upload_skipped reason=invalid_format
          </div>
          <div className="text-muted-text">
            12:06:11.004 INFO health_check status=ok
          </div>
        </div>
      </PageSection>
    </div>
  );
}

