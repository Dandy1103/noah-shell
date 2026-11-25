import { CanActivateFn } from '@angular/router';

let sessionCheck: Promise<boolean> | undefined;

export function sendToLogin(): void {
  const next = location.pathname + location.search;
  location.replace('/auth/login?' + new URLSearchParams({ next }));
}

function checkSession(): Promise<boolean> {
  sessionCheck ??= fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' })
    .then((response) => {
      if (response.ok) return true;
      if (response.status === 401) sendToLogin();
      return false;
    })
    .catch(() => {
      sendToLogin();
      return false;
    });
  return sessionCheck;
}

export const requireSession: CanActivateFn = () => checkSession();

export async function signedIn(): Promise<boolean> {
  return checkSession();
}
