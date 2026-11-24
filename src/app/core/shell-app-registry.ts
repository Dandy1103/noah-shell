import { Injectable } from '@angular/core';

export interface ShellAppContext {
  repo: string;
  pathname: string;
}

export interface MountedShellApp {
  unmount(): void | Promise<void>;
}

export interface ShellAppModule {
  mount(host: HTMLElement, context: ShellAppContext): MountedShellApp | Promise<MountedShellApp>;
}

export type ShellAppLoader = () => Promise<ShellAppModule>;

@Injectable({ providedIn: 'root' })
export class ShellAppRegistry {
  private readonly loaders = new Map<string, ShellAppLoader>();

  register(repo: string, loader: ShellAppLoader): void {
    this.loaders.set(repo, loader);
  }

  loader(repo: string): ShellAppLoader | undefined {
    return this.loaders.get(repo);
  }
}
