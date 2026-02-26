import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { PageSection } from '../components/PageSection';

const API_BASE_URL = 'http://localhost:8000';

interface LocalImage {
  file: File;
  previewUrl: string;
}

interface UploadResponse {
  uploaded: number;
}

export function Dataset() {
  const [images, setImages] = useState<LocalImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(
    () => () => {
      images.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    },
    [images],
  );

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const validFiles: LocalImage[] = [];
    Array.from(fileList).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        return;
      }
      const url = URL.createObjectURL(file);
      validFiles.push({ file, previewUrl: url });
    });

    if (validFiles.length === 0) {
      setLastError('Please provide image files only.');
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
    void uploadImages(validFiles.map((item) => item.file));
  }, []);

  const onFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const uploadImages = async (files: File[]) => {
    if (!files.length) return;

    setIsUploading(true);
    setProgress(0);
    setLastError(null);

    let simulated = 0;
    const timer = window.setInterval(() => {
      simulated = Math.min(simulated + 5, 90);
      setProgress(simulated);
      if (simulated >= 90) {
        window.clearInterval(timer);
      }
    }, 150);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch(`${API_BASE_URL}/api/v1/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const detail = await res
          .json()
          .catch(() => ({ detail: 'Failed to upload dataset images.' }));
        throw new Error(detail.detail ?? 'Failed to upload dataset images.');
      }

      const data = (await res.json()) as UploadResponse;
      setUploadedCount((prev) => (prev ?? 0) + data.uploaded);
      setProgress(100);
      window.setTimeout(() => setProgress(0), 500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error during upload.';
      setLastError(message);
      setProgress(0);
    } finally {
      window.clearInterval(timer);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageSection
        title="Dataset overview"
        description="Summary of images and labels used for training."
      >
        <div className="grid gap-3 text-xs sm:grid-cols-3">
          <div className="rounded-md bg-muted px-3 py-3">
            <div className="text-[11px] text-muted-text">Total images (mock)</div>
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
        title="Upload images"
        description="Drop multiple surface images to add them to the dataset. Backend will store them in ./data/images."
      >
        <div className="flex flex-col gap-4 text-xs text-muted-text md:flex-row">
          <div className="flex-1 space-y-3">
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-8 transition-colors ${
                isDragging
                  ? 'border-accent-blue bg-accent-blue/10'
                  : 'border-muted bg-muted hover:border-accent-blue/70'
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <span className="mb-2 text-[11px] font-medium text-text">
                Drag &amp; drop images
              </span>
              <span className="mb-2 text-[11px] text-muted-text">
                or select from your computer
              </span>
              <label className="inline-flex cursor-pointer items-center rounded-md bg-accent-blue px-3 py-1.5 text-[11px] font-medium text-bg hover:bg-accent-blue/90">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onFileInputChange}
                />
                Select images
              </label>
              {uploadedCount !== null ? (
                <span className="mt-3 text-[11px] text-muted-text">
                  Uploaded this session: {uploadedCount} files
                </span>
              ) : null}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span>Upload progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel">
                <div
                  className="h-full rounded-full bg-accent-blue transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {isUploading && (
                <p className="mt-1 text-[11px] text-muted-text">
                  Uploading images to backend…
                </p>
              )}
            </div>
          </div>

          <div className="w-full space-y-2 md:w-72">
            <div className="rounded-md bg-muted px-3 py-3 text-[11px] text-muted-text">
              <div className="mb-1 font-semibold text-text">Upload rules</div>
              <ul className="list-disc space-y-1 pl-4">
                <li>Images only (PNG, JPG, etc.).</li>
                <li>Max file size: 10 MB per image.</li>
                <li>Files are stored server-side in ./data/images.</li>
              </ul>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="Preview thumbnails"
        description="Client-side preview of images selected in this session."
      >
        {images.length === 0 ? (
          <p className="text-[11px] text-muted-text">
            No images selected yet. Upload some to see their thumbnails here.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((item, index) => (
              <div
                key={`${item.file.name}-${index}`}
                className="overflow-hidden rounded-md border border-muted bg-muted"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="truncate px-2 py-1.5 text-[11px] text-muted-text">
                  {item.file.name}
                </div>
              </div>
            ))}
          </div>
        )}
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

      {lastError && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-md border border-accent-red/40 bg-panel px-3 py-2 text-[11px] text-muted-text shadow-lg">
          <div className="mb-1 flex items-center justify-between gap-4">
            <span className="font-semibold text-accent-red">Upload error</span>
            <button
              type="button"
              className="text-muted-text hover:text-text"
              onClick={() => setLastError(null)}
            >
              ✕
            </button>
          </div>
          <p>{lastError}</p>
        </div>
      )}
    </div>
  );
}

