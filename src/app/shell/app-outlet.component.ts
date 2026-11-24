import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { appFromPath } from '../core/app-manifest';
import { MountedShellApp, ShellAppRegistry } from '../core/shell-app-registry';

@Component({
  selector: 'noah-app-outlet',
  standalone: true,
  template: `
    <div class="app-outlet" [attr.data-app]="appLabel()">
      <div #host class="app-host"></div>
      @if (state() === 'unregistered') {
          <section class="empty-state">
            <p class="eyebrow">{{ appLabel() }}</p>
            <h1>App 掛載區已就緒</h1>
            <p>下一步將這個 App 改成可由 Shell 載入的模組。</p>
          </section>
        } @else if (state() === 'loading') {
          <p class="loading" role="status">正在載入 {{ appLabel() }}…</p>
        } @else if (state() === 'failed') {
          <p class="error" role="alert">{{ appLabel() }} 載入失敗，請重新整理。</p>
        }
    </div>
  `,
  styleUrl: './app-outlet.component.scss',
})
export class AppOutletComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly registry = inject(ShellAppRegistry);
  private readonly subscription = new Subscription();
  private mounted: MountedShellApp | null = null;
  private loadId = 0;

  @ViewChild('host', { static: true }) private host!: ElementRef<HTMLElement>;

  readonly appLabel = signal(appFromPath(location.pathname).label);
  readonly state = signal<'loading' | 'mounted' | 'unregistered' | 'failed'>('loading');

  ngAfterViewInit(): void {
    this.subscription.add(
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => void this.mountCurrent()),
    );
    void this.mountCurrent();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loadId += 1;
    void this.mounted?.unmount();
  }

  private async mountCurrent(): Promise<void> {
    const requestId = ++this.loadId;
    if (this.mounted) {
      await this.mounted.unmount();
      this.mounted = null;
      this.host.nativeElement.replaceChildren();
    }

    const app = appFromPath(location.pathname);
    this.appLabel.set(app.label);
    const loader = this.registry.loader(app.repo);
    if (!loader) {
      this.state.set('unregistered');
      return;
    }

    this.state.set('loading');
    try {
      const module = await loader();
      const mounted = await module.mount(this.host.nativeElement, { repo: app.repo, pathname: location.pathname });
      if (requestId !== this.loadId) {
        await mounted.unmount();
        return;
      }
      this.mounted = mounted;
      this.state.set('mounted');
    } catch {
      if (requestId === this.loadId) this.state.set('failed');
    }
  }
}
