import { CanActivateFn } from '@angular/router';

export function sendToLogin(): void {
  const next = location.pathname + location.search;
  location.replace('/auth/login?' + new URLSearchParams({ next }));
}

export const requireSession: CanActivateFn = () => {
  return fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' }).then((response) => {
    if (response.ok) return true;
    if (response.status === 401) sendToLogin();
    return false;
  }).catch(() => false);
};

export async function signedIn(): Promise<boolean> {
  const response = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' }).catch(() => null);
  if (response?.ok) return true;
  if (!response || response.status === 401) sendToLogin();
  return false;
}
