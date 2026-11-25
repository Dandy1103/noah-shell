import { isDevMode } from '@angular/core';

const reloadUrl = 'http://127.0.0.1:4390';

export function watchRemoteRebuild(): void {
  if (!isDevMode()) return;
  void listen();
}

async function listen(): Promise<void> {
  const ready = await fetch(`${reloadUrl}/health`, { cache: 'no-store' }).then((response) => response.ok).catch(() => false);
  if (!ready) {
    window.setTimeout(() => void listen(), 2000);
    return;
  }
  const source = new EventSource(`${reloadUrl}/events`);
  source.addEventListener('reload', () => location.reload());
  source.onerror = () => {
    source.close();
    window.setTimeout(() => void listen(), 2000);
  };
}
