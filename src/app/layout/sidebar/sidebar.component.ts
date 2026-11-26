import { Component, DestroyRef, HostListener, Input, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

export interface NoahSidebarSection {
  title: string;
  links: readonly { label: string; path: string; exact?: boolean }[];
}

@Component({
  selector: 'noah-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class NoahSidebarComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private items: readonly NoahSidebarSection[] = [];

  @Input({ required: true }) set sections(value: readonly NoahSidebarSection[]) {
    this.items = value;
    this.selectSectionForCurrentRoute();
  }

  get sections(): readonly NoahSidebarSection[] {
    return this.items;
  }

  readonly selectedSection = signal(0);
  readonly mobileOpen = signal(false);

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.selectSectionForCurrentRoute();
      this.mobileOpen.set(false);
    });
  }

  get visibleSection(): NoahSidebarSection | null {
    return this.sections[this.selectedSection()] ?? this.sections[0] ?? null;
  }

  currentPageLabel(index: number): string | null {
    const section = this.sections[index];
    if (!section) return null;
    return section.links.find((link) => this.matchesCurrentRoute(link))?.label ?? null;
  }

  toggleSection(index: number): void {
    const closing = this.mobileOpen() && this.selectedSection() === index;
    this.selectedSection.set(index);
    this.mobileOpen.set(!closing);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.closeMobile();
  }

  private selectSectionForCurrentRoute(): void {
    const index = this.sections.findIndex((section) => section.links.some((link) => this.matchesCurrentRoute(link)));
    if (index >= 0) this.selectedSection.set(index);
  }

  private matchesCurrentRoute(link: NoahSidebarSection['links'][number]): boolean {
    const current = this.router.url.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
    const path = link.path.replace(/\/+$/, '') || '/';
    return link.exact === true || path === '/'
      ? current === path
      : current === path || current.startsWith(`${path}/`);
  }
}
