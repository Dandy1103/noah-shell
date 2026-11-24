import { Component, HostListener, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  NoahHeaderAction,
  NoahHeaderComponent,
  NoahNavbarComponent,
  NoahSidebarComponent,
  NoahSidebarSection,
} from '@dandy1103/ui';
import type { NavCatalog, NavGroup } from '@dandy1103/ui';
import { Subscription, filter } from 'rxjs';
import { SHELL_APPS, appByRepo, appFromPath } from './core/app-manifest';
import { CatalogStore } from './core/catalog.store';
import { ShellSessionStore } from './core/shell-session.store';

@Component({
  selector: 'noah-root',
  standalone: true,
  imports: [RouterOutlet, NoahHeaderComponent, NoahNavbarComponent, NoahSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly catalogStore = inject(CatalogStore);
  private readonly sessionStore = inject(ShellSessionStore);
  private readonly subscription = new Subscription();
  private readonly pathname = signal(location.pathname);

  readonly activeApp = computed(() => appFromPath(this.pathname()));
  readonly catalog = this.catalogStore.catalog;
  readonly userName = this.sessionStore.userName;
  readonly navGroups = computed(() => buildNavbar(this.catalog()));
  readonly sidebar = computed(() => {
    const app = this.activeApp();
    return app.layout === 'sidebar' ? buildSidebar(this.catalog(), app.repo) : [];
  });
  readonly currentLabel = computed(() => {
    const app = this.activeApp();
    return this.catalog()?.systems.find((system) => system.repo === app.repo)?.name?.trim() || app.label;
  });
  readonly headerActions: readonly NoahHeaderAction[] = [
    { label: '個人資料', href: '/portal/profile' },
    { label: '我的權限', href: '/portal/permissions' },
    { label: '變更密碼', href: '/auth/change-password' },
    { label: '登出', href: '/auth/logout', method: 'post' },
  ];

  constructor() {
    effect((onCleanup) => {
      const route = this.activeApp().route;
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = `/remotes/${route}/styles.css`;
      stylesheet.dataset['noahRemoteStyles'] = route;
      document.head.append(stylesheet);
      onCleanup(() => stylesheet.remove());
    });
    this.subscription.add(
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => this.pathname.set(new URL(event.urlAfterRedirects, location.origin).pathname)),
    );
    void this.catalogStore.refresh();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  keepShellNavigation(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    const anchor = target instanceof Element ? target.closest('a[href]') : null;
    if (!(anchor instanceof HTMLAnchorElement) || anchor.target || anchor.hasAttribute('download')) return;

    const destination = new URL(anchor.href, location.href);
    if (destination.origin !== location.origin) return;
    const route = destination.pathname.replace(/^\/+/, '').split('/')[0];
    if (!SHELL_APPS.some((app) => app.route === route)) return;

    event.preventDefault();
    void this.router.navigateByUrl(`${destination.pathname}${destination.search}${destination.hash}`);
  }
}

function buildNavbar(catalog: NavCatalog | null): NavGroup[] {
  if (!catalog) return [];
  const online = new Map(catalog.systems.map((system) => [system.repo, system.online]));
  return catalog.groups.map((group) => ({
    label: catalog.systems.find((system) => system.repo === group.app)?.name?.trim() || group.label,
    sections: group.sections.map((section) => ({
      title: section.title,
      links: section.links.map((link) => ({
        label: link.label,
        href: link.app && online.get(link.app) === true ? shellHref(link.app, link.path) : null,
      })),
    })),
  }));
}

function buildSidebar(catalog: NavCatalog | null, repo: string): NoahSidebarSection[] {
  const group = catalog?.groups.find((item) => item.app === repo);
  if (!group) return [];
  return group.sections.map((section) => ({
    title: section.title,
    links: section.links
      .filter((link) => link.app === repo)
      .map((link) => ({ label: link.label, path: shellHref(repo, link.path) ?? '/' })),
  }));
}

function shellHref(repo: string, path: string): string | null {
  const app = appByRepo(repo);
  if (!app) return null;
  const suffix = path.replace(/^\/+/, '');
  return suffix ? `/${app.route}/${suffix}` : `/${app.route}`;
}
