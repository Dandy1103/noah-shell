import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShellSessionStore {
  private readonly name = signal('');
  readonly userName = this.name.asReadonly();

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    const employee = await displayName('/api/me/employee');
    this.name.set(employee || await displayName('/api/session'));
  }
}

async function displayName(path: string): Promise<string> {
  try {
    const response = await fetch(path, { cache: 'no-store', credentials: 'same-origin' });
    if (!response.ok) return '';
    const body = await response.json() as { displayName?: unknown };
    return typeof body.displayName === 'string' ? body.displayName.trim() : '';
  } catch {
    return '';
  }
}
