import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'noah-remote-error',
  standalone: true,
  template: `
    <section class="remote-error" role="alert">
      <h1>功能暫時無法載入</h1>
      <p>{{ app }} 的程式沒有載入完成，請重新整理後再試一次。</p>
      <button type="button" (click)="reload()">重新整理</button>
    </section>
  `,
  styles: `
    .remote-error { max-width: 520px; margin: 64px auto; padding: 32px; border: 1px solid var(--color-border); border-radius: 8px; background: #fff; }
    h1 { margin: 0 0 12px; font-size: 24px; }
    p { margin: 0 0 20px; color: var(--color-text-secondary); }
    button { min-height: 40px; padding: 0 16px; border: 0; border-radius: var(--radius-sm); background: var(--color-primary); color: #fff; cursor: pointer; }
  `,
})
export class RemoteErrorComponent {
  readonly app = inject(ActivatedRoute).snapshot.data['app'] as string;

  reload(): void {
    location.reload();
  }
}
