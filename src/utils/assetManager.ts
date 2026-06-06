import { PreloadProgress } from "@/types";
import { debugWarn, updateDebugState } from "@/utils/debugStore";

type ProgressCallback = (progress: PreloadProgress) => void;

export interface PreloadResult {
  loaded: string[];
  failed: string[];
}

/** Inline SVG placeholder when an image fails to load */
export const FALLBACK_IMAGE_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#FBEFEF"/>
      <text x="200" y="150" text-anchor="middle" fill="#8E6C6C" font-family="Georgia,serif" font-size="16">Memory</text>
    </svg>`
  );

class AssetManagerClass {
  private cache = new Map<string, HTMLImageElement>();
  private loading = new Set<string>();
  private failed = new Set<string>();
  loadedPaths: string[] = [];
  failedPaths: string[] = [];

  preloadImage(src: string, timeoutMs = 15000): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return Promise.resolve(this.cache.get(src)!);
    }

    if (this.failed.has(src)) {
      return Promise.resolve(this.createFallbackElement(src));
    }

    if (this.loading.has(src)) {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (this.cache.has(src)) {
            clearInterval(check);
            resolve(this.cache.get(src)!);
          } else if (this.failed.has(src)) {
            clearInterval(check);
            resolve(this.createFallbackElement(src));
          }
        }, 50);
        setTimeout(() => {
          clearInterval(check);
          if (!this.cache.has(src)) {
            this.markFailed(src);
            resolve(this.createFallbackElement(src));
          }
        }, timeoutMs);
      });
    }

    this.loading.add(src);

    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";

      const finish = (element: HTMLImageElement, ok: boolean) => {
        this.loading.delete(src);
        if (ok) {
          this.cache.set(src, element);
          if (!this.loadedPaths.includes(src)) this.loadedPaths.push(src);
        } else {
          this.markFailed(src);
        }
        this.syncDebug();
        resolve(ok ? element : this.createFallbackElement(src));
      };

      img.onload = () => finish(img, true);
      img.onerror = () => {
        debugWarn("Image failed to load, using placeholder", src);
        finish(img, false);
      };
      img.src = src;
    });
  }

  private createFallbackElement(originalSrc: string): HTMLImageElement {
    if (this.cache.has(`fallback:${originalSrc}`)) {
      return this.cache.get(`fallback:${originalSrc}`)!;
    }
    const img = new Image();
    img.src = FALLBACK_IMAGE_SRC;
    this.cache.set(`fallback:${originalSrc}`, img);
    return img;
  }

  private markFailed(src: string): void {
    if (!this.failed.has(src)) {
      this.failed.add(src);
      this.failedPaths.push(src);
    }
  }

  private syncDebug(): void {
    updateDebugState({
      loadedImages: this.loadedPaths.length,
      failedImages: [...this.failedPaths],
    });
  }

  async preloadImages(
    sources: string[],
    onProgress?: ProgressCallback
  ): Promise<PreloadResult> {
    return this.preloadImagesSettled(sources, onProgress);
  }

  async preloadImagesSettled(
    sources: string[],
    onProgress?: ProgressCallback
  ): Promise<PreloadResult> {
    const total = sources.length;
    let settled = 0;

    const update = () => {
      settled++;
      onProgress?.({
        loaded: this.loadedPaths.length,
        total,
        percentage: Math.round((settled / total) * 100),
      });
    };

    const results = await Promise.allSettled(
      sources.map((src) => this.preloadImage(src))
    );

    results.forEach((r, i) => {
      if (r.status === "rejected") {
        this.markFailed(sources[i]);
        debugWarn("Preload rejected", sources[i]);
      }
      update();
    });

    this.syncDebug();
    return { loaded: [...this.loadedPaths], failed: [...this.failedPaths] };
  }

  /** Preload a batch without blocking — for background loading */
  preloadInBackground(sources: string[]): void {
    void this.preloadImagesSettled(sources);
  }

  getCached(src: string): HTMLImageElement | undefined {
    return this.cache.get(src) ?? this.cache.get(`fallback:${src}`);
  }

  clear(): void {
    this.cache.clear();
    this.loading.clear();
    this.failed.clear();
    this.loadedPaths = [];
    this.failedPaths = [];
    this.syncDebug();
  }
}

export const AssetManager = new AssetManagerClass();
