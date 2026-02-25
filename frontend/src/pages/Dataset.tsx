import { PageSection } from '../components/PageSection';

export function Dataset() {
  return (
    <div className="space-y-4">
      <PageSection
        title="Dataset overview"
        description="Summary of images and labels used for training."
      >
        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-md bg-muted px-3 py-3">
            <div className="text-[11px] text-muted-text">Total images</div>
            <div className="mt-1 text-lg font-semibold text-text">18,240</div>
          </div>
          <div className="rounded-md bg-muted px-3 py-3">
            <div className="text-[11px] text-muted-text">Labeled defects</div>
            <div className="mt-1 text-lg font-semibold text-accent-red">3,421</div>
          </div>
          <div className="rounded-md bg-muted px-3 py-3">
            <div className="text-[11px] text-muted-text">Last sync</div>
            <div className="mt-1 text-lg font-semibold text-success">2h ago</div>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="Datasets"
        description="Mock list of dataset splits and versions."
      >
        <div className="overflow-hidden rounded-md border border-muted bg-muted text-xs">
          <table className="w-full border-collapse">
            <thead className="bg-panel text-[11px] text-muted-text">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium">Split</th>
                <th className="px-3 py-2 text-left font-medium">Images</th>
                <th className="px-3 py-2 text-left font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-muted/60">
                <td className="px-3 py-2 text-text">Surface-Defects-v1</td>
                <td className="px-3 py-2 text-muted-text">Train</td>
                <td className="px-3 py-2 text-muted-text">14,000</td>
                <td className="px-3 py-2 text-muted-text">Yesterday</td>
              </tr>
              <tr className="border-t border-muted/60">
                <td className="px-3 py-2 text-text">Surface-Defects-v1</td>
                <td className="px-3 py-2 text-muted-text">Validation</td>
                <td className="px-3 py-2 text-muted-text">2,400</td>
                <td className="px-3 py-2 text-muted-text">Yesterday</td>
              </tr>
              <tr className="border-t border-muted/60">
                <td className="px-3 py-2 text-text">Surface-Defects-v1</td>
                <td className="px-3 py-2 text-muted-text">Test</td>
                <td className="px-3 py-2 text-muted-text">1,840</td>
                <td className="px-3 py-2 text-muted-text">3 days ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PageSection>
    </div>
  );
}

