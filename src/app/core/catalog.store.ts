import { Injectable, computed, signal } from '@angular/core';
import type { NavCatalog } from '../layout/navbar/nav-catalog';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly value = signal<NavCatalog | null>(null);
  private readonly state = signal<'idle' | 'refreshing' | 'ready' | 'unavailable'>('idle');
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
    try {
      const response = await fetch('/api/apps/catalog', {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`Catalog request failed with ${response.status}`);
      const candidate: unknown = await response.json();
      if (!isCatalog(candidate)) throw new Error('Catalog response has an invalid shape');
      this.value.set(candidate);
      this.state.set('ready');
    } catch {
      this.value.set(null);
      this.state.set('unavailable');
    }
  }
}

function isCatalog(value: unknown): value is NavCatalog {
  if (!value || typeof value !== 'object') return false;
  const record = value as { systems?: unknown; groups?: unknown };
  return Array.isArray(record.systems) && Array.isArray(record.groups);
}
