import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Group } from 'react-konva';
import { PageSection } from '../components/PageSection';

const API_BASE_URL = 'http://localhost:8000';

interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
}

interface PredictMeta {
  width: number;
  height: number;
  inference_ms: number;
}

interface PredictResponse {
  detections: Detection[];
  meta: PredictMeta;
}

export function Inference() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [konvaImage, setKonvaImage] = useState<HTMLImageElement | null>(null);
  const [response, setResponse] = useState<PredictResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stageWidth, setStageWidth] = useState<number>(640);
  const stageHeight = 420;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resize = () => {
      const rect = el.getBoundingClientRect();
      setStageWidth(Math.max(320, rect.width));
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!imageUrl) {
      setKonvaImage(null);
      return;
    }
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => setKonvaImage(img);
    return () => {
      setKonvaImage(null);
    };
  }, [imageUrl]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    setResponse(null);
    setSelectedIndex(null);

    void runPrediction(file);
  }, []);

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const runPrediction = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE_URL}/api/v1/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const detail = await res
          .json()
          .catch(() => ({ detail: 'Failed to run prediction.' }));
        throw new Error(detail.detail ?? 'Failed to run prediction.');
      }

      const data = (await res.json()) as PredictResponse;
      setResponse(data);
      setSelectedIndex(0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!response) return;
    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'detections.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const { displayWidth, displayHeight, offsetX, offsetY, scale } = useMemo(() => {
    if (!response?.meta) {
      return {
        displayWidth: stageWidth,
        displayHeight: stageHeight,
        offsetX: 0,
        offsetY: 0,
        scale: 1,
      };
    }
    const { width, height } = response.meta;
    if (width === 0 || height === 0) {
      return {
        displayWidth: stageWidth,
        displayHeight: stageHeight,
        offsetX: 0,
        offsetY: 0,
        scale: 1,
      };
    }
    const scaleX = stageWidth / width;
    const scaleY = stageHeight / height;
    const s = Math.min(scaleX, scaleY);
    const dw = width * s;
    const dh = height * s;
    const ox = (stageWidth - dw) / 2;
    const oy = (stageHeight - dh) / 2;
    return {
      displayWidth: dw,
      displayHeight: dh,
      offsetX: ox,
      offsetY: oy,
      scale: s,
    };
  }, [response?.meta, stageWidth]);

  return (
    <div className="space-y-4">
      <PageSection
        title="Run inference"
        description="Upload a surface image and run the backend model to preview YOLO-style detections."
      >
        <div className="flex flex-col gap-3 text-xs text-muted-text md:flex-row">
          <div className="flex-1 space-y-2">
            <label className="block text-[11px] font-medium text-muted-text">
              Input image
            </label>
            <div
              className={`flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-3 py-6 transition-colors ${
                isDragging
                  ? 'border-accent-blue bg-accent-blue/10'
                  : 'border-muted bg-muted hover:border-accent-blue/70'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <span className="mb-2 text-[11px] font-medium text-text">
                Drag &amp; drop an image
              </span>
              <span className="text-[11px] text-muted-text mb-2">or</span>
              <label className="inline-flex cursor-pointer items-center rounded-md bg-accent-blue px-3 py-1.5 text-[11px] font-medium text-bg hover:bg-accent-blue/90">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                Select image
              </label>
              {imageFile ? (
                <span className="mt-2 text-[11px] text-muted-text">
                  Selected: {imageFile.name}
                </span>
              ) : null}
            </div>
          </div>
          <div className="w-full space-y-2 md:w-64">
            <label className="block text-[11px] font-medium text-muted-text">
              Model
            </label>
            <select
              className="w-full rounded-md border border-muted bg-muted px-2 py-1.5 text-xs text-text outline-none"
              defaultValue="yolo-surface-v1"
            >
              <option value="yolo-surface-v1">YOLO Surface v1</option>
              <option value="yolo-surface-v2">YOLO Surface v2</option>
            </select>
            <button
              type="button"
              onClick={() => imageFile && void runPrediction(imageFile)}
              disabled={!imageFile || isLoading}
              className={`mt-3 w-full rounded-md px-3 py-1.5 text-[11px] font-medium ${
                !imageFile || isLoading
                  ? 'cursor-not-allowed bg-muted text-muted-text'
                  : 'bg-accent-blue text-bg hover:bg-accent-blue/90'
              }`}
            >
              {isLoading ? 'Running inference…' : 'Run inference again'}
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              disabled={!response}
              className={`w-full rounded-md px-3 py-1.5 text-[11px] font-medium ${
                !response
                  ? 'cursor-not-allowed bg-muted text-muted-text'
                  : 'bg-panel text-muted-text hover:bg-muted'
              }`}
            >
              Export JSON
            </button>
            {response?.meta ? (
              <div className="mt-2 space-y-1 text-[11px] text-muted-text">
                <div>
                  Image: {response.meta.width} × {response.meta.height}
                </div>
                <div>Inference: {response.meta.inference_ms.toFixed(1)} ms</div>
              </div>
            ) : null}
          </div>
        </div>
      </PageSection>

      <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <PageSection
          title="Preview"
          description="Model detections rendered on top of the input image."
        >
          <div ref={containerRef} className="relative h-[420px] rounded-md bg-muted">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg/40">
                <div className="flex items-center gap-2 rounded-md bg-panel px-3 py-2 text-[11px] text-muted-text">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent-blue border-t-transparent" />
                  <span>Running inference…</span>
                </div>
              </div>
            )}
            <Stage width={stageWidth} height={stageHeight}>
              <Layer>
                {konvaImage && (
                  <KonvaImage
                    image={konvaImage}
                    x={offsetX}
                    y={offsetY}
                    width={displayWidth}
                    height={displayHeight}
                  />
                )}
                {response?.detections.map((det, index) => {
                  const [x, y, w, h] = det.bbox;
                  const scaledX = offsetX + x * scale;
                  const scaledY = offsetY + y * scale;
                  const scaledW = w * scale;
                  const scaledH = h * scale;

                  const isSelected = selectedIndex === index;
                  const isSevere = det.class === 'scratch' || det.confidence >= 0.9;
                  const color = isSevere ? '#e53935' : '#1f7aec';

                  const labelText = `${det.class} · ${(det.confidence * 100).toFixed(
                    1,
                  )}%`;
                  const labelPaddingX = 6;
                  return (
                    <Group
                      key={`${det.class}-${index}`}
                      onClick={() => setSelectedIndex(index)}
                      onTap={() => setSelectedIndex(index)}
                    >
                      <Rect
                        x={scaledX}
                        y={scaledY}
                        width={scaledW}
                        height={scaledH}
                        stroke={color}
                        strokeWidth={isSelected ? 3 : 2}
                        fill={color}
                        opacity={0.15}
                      />
                      <Rect
                        x={scaledX}
                        y={scaledY - 18}
                        width={labelText.length * 6 + labelPaddingX * 2}
                        height={16}
                        fill={color}
                        cornerRadius={999}
                        opacity={0.9}
                      />
                      <Text
                        x={scaledX + labelPaddingX}
                        y={scaledY - 16}
                        text={labelText}
                        fontSize={10}
                        fill="#000000"
                      />
                    </Group>
                  );
                })}
              </Layer>
            </Stage>
          </div>
        </PageSection>

        <PageSection
          title="Detections"
          description="Click a detection to highlight its bounding box."
        >
          <div className="flex h-[420px] flex-col rounded-md bg-muted text-xs text-muted-text">
            <div className="flex items-center justify-between border-b border-panel px-3 py-2 text-[11px]">
              <span>
                {response?.detections.length
                  ? `${response.detections.length} detections`
                  : 'No detections yet'}
              </span>
            </div>
            <div className="flex-1 overflow-auto px-2 py-2">
              {response?.detections.map((det, index) => {
                const isSelected = selectedIndex === index;
                const isSevere = det.class === 'scratch' || det.confidence >= 0.9;
                const color = isSevere ? 'text-accent-red' : 'text-accent-blue';
                return (
                  <button
                    key={`${det.class}-${index}`}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`mb-1 flex w-full flex-col items-start rounded-md px-3 py-2 text-left transition-colors ${
                      isSelected
                        ? 'bg-accent-blue/20 text-text'
                        : 'bg-panel text-muted-text hover:bg-panel/80'
                    }`}
                  >
                    <span className={`text-[11px] font-semibold ${color}`}>
                      {det.class}
                    </span>
                    <span className="text-[11px]">
                      Confidence: {(det.confidence * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-muted-text/80">
                      bbox: [{det.bbox.map((v) => v.toFixed(1)).join(', ')}]
                    </span>
                  </button>
                );
              })}
              {!response && (
                <p className="px-1 text-[11px] text-muted-text">
                  Run inference to see detections listed here.
                </p>
              )}
            </div>
          </div>
        </PageSection>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-md border border-accent-red/40 bg-panel px-3 py-2 text-[11px] text-muted-text shadow-lg">
          <div className="mb-1 flex items-center justify-between gap-4">
            <span className="font-semibold text-accent-red">Inference error</span>
            <button
              type="button"
              className="text-muted-text hover:text-text"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

