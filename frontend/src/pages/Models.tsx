import { useEffect, useState } from 'react';
import { PageSection } from '../components/PageSection';

const API_BASE_URL = 'http://localhost:8000';

interface ModelInfo {
  name: string;
  version: string;
  loaded: boolean;
}

interface ModelLoadResponse {
  name: string;
  version: string;
  loaded: boolean;
}

export function Models() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeName, setActiveName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/v1/models`);
      if (!res.ok) {
        throw new Error('Failed to fetch models.');
      }
      const data = (await res.json()) as ModelInfo[];
      setModels(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error fetching models.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchModels();
  }, []);

  const handleLoadModel = async (model: ModelInfo) => {
    try {
      setActiveName(model.name);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/v1/models/load`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: model.name, version: model.version }),
      });

      if (!res.ok) {
        const detail = await res
          .json()
          .catch(() => ({ detail: 'Failed to toggle model state.' }));
        throw new Error(detail.detail ?? 'Failed to toggle model state.');
      }

      const updated = (await res.json()) as ModelLoadResponse;
      setModels((prev) =>
        prev.map((m) =>
          m.name === updated.name ? { ...m, loaded: updated.loaded, version: updated.version } : m,
        ),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error loading model.';
      setError(message);
    } finally {
      setActiveName(null);
    }
  };

  return (
    <div className="space-y-4">
      <PageSection
        title="Models"
        description="Mock list of available detection models backed by the API."
      >
        <div className="space-y-2 text-xs">
          {isLoading && models.length === 0 && (
            <p className="text-[11px] text-muted-text">Loading models…</p>
          )}
          {!isLoading && models.length === 0 && !error && (
            <p className="text-[11px] text-muted-text">No models returned by API.</p>
          )}
          {models.map((model) => {
            const isRunning = model.loaded;
            const isBusy = activeName === model.name;
            return (
              <div
                key={model.name}
                className="flex items-center justify-between rounded-md bg-muted px-3 py-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-text">{model.name}</div>
                    <span className="rounded-full bg-panel px-2 py-0.5 text-[10px] text-muted-text">
                      v{model.version}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-text">
                    <span
                      className={`inline-flex items-center gap-1 ${
                        isRunning ? 'text-success' : 'text-muted-text'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isRunning ? 'bg-success' : 'bg-muted-text'
                        }`}
                      />
                      {isRunning ? 'Running' : 'Idle'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => void handleLoadModel(model)}
                    className={`rounded-md px-3 py-1.5 text-[11px] font-medium ${
                      isBusy
                        ? 'cursor-not-allowed bg-muted text-muted-text'
                        : 'bg-accent-blue text-bg hover:bg-accent-blue/90'
                    }`}
                  >
                    {isRunning ? 'Unload model' : 'Load model'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </PageSection>

      {error && (
        <PageSection title="Models error">
          <p className="text-[11px] text-accent-red">{error}</p>
        </PageSection>
      )}
    </div>
  );
}

