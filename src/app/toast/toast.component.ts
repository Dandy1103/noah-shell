import { Component, inject } from '@angular/core';
import { ToastService } from '@dandy1103/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div role="status" aria-live="polite" aria-atomic="true">
      @if (toast.notice(); as current) {
        <div class="toast" [class.toast--error]="current.variant === 'error'"
          [class.toast--leaving]="toast.isLeaving()" [style.--toast-fade-duration]="toast.fadeDuration">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            @if (current.variant === 'error') {
              <path d="m7 7 10 10m0-10L7 17" />
            } @else {
              <path d="M5 12.5 9.5 17 19 7" />
            }
          </svg>
          <div class="toast__text">
            <span>{{ current.message }}</span>
            @if (current.detail) {
              <span class="toast__detail">{{ current.detail }}</span>
            }
          </div>
          <button type="button" class="toast__close"
            [attr.aria-label]="current.variant === 'error' ? '關閉失敗提示' : '關閉成功提示'"
            [disabled]="toast.isLeaving()" (click)="toast.dismiss()">
            <span aria-hidden="true">×</span>
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
