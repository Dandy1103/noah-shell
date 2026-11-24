import { Injectable, computed, signal } from '@angular/core';
import type { NavCatalog } from '@dandy1103/ui';

interface CatalogCache {
  version: 1;
  etag: string;
  savedAt: number;
  value: NavCatalog;
}

const CACHE_KEY = 'noah:shell:catalog:v1';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly cached = readCache();
  private readonly value = signal<NavCatalog | null>(this.cached?.value ?? null);
  private readonly state = signal<'idle' | 'refreshing' | 'ready' | 'unavailable'>(this.cached ? 'ready' : 'idle');
  private activeRequest: Promise<void> | null = null;

  readonly catalog = this.value.asReadonly();
  readonly status = this.state.asReadonly();
  readonly hasCatalog = computed(() => this.value() !== null);

  refresh(): Promise<void> {
    if (this.activeRequest) return this.activeRequest;
    this.state.set('refreshing');
    this.activeRequest = this.fetchCatalog().finally(() => {
      this.activeRequest = null;
    });
    return this.activeRequest;
  }

  private async fetchCatalog(): Promise<void> {
    const cached = readCache();
    const headers = new Headers();
    if (cached?.etag) headers.set('If-None-Match', cached.etag);

    try {
      const response = await fetch('/api/apps/catalog', { headers, credentials: 'same-origin' });
      if (response.status === 304 && cached) {
        this.value.set(cached.value);
        this.state.set('ready');
        return;
      }
      if (!response.ok) throw new Error(`Catalog request failed with ${response.status}`);
      const candidate: unknown = await response.json();
      if (!isCatalog(candidate)) throw new Error('Catalog response has an invalid shape');

      this.value.set(candidate);
      this.state.set('ready');
      writeCache({
        version: 1,
        etag: response.headers.get('ETag') ?? '',
        savedAt: Date.now(),
        value: candidate,
      });
    } catch {
      this.state.set(this.value() ? 'ready' : 'unavailable');
    }
  }
}

function isCatalog(value: unknown): value is NavCatalog {
  if (!value || typeof value !== 'object') return false;
  const record = value as { systems?: unknown; groups?: unknown };
  return Array.isArray(record.systems) && Array.isArray(record.groups);
}

function readCache(): CatalogCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const cache = parsed as Partial<CatalogCache>;
    return cache.version === 1 && typeof cache.etag === 'string' && typeof cache.savedAt === 'number' && isCatalog(cache.value)
      ? cache as CatalogCache
      : null;
  } catch {
    return null;
  }
}

function writeCache(cache: CatalogCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Catalog 仍保留在記憶體，儲存空間不可用不影響目前畫面。
  }
}
