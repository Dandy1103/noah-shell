import { SHELL_APPS, appByRepo, appFromPath } from './app-manifest';

describe('app manifest', () => {
  it('has a unique route and repo for every app', () => {
    expect(new Set(SHELL_APPS.map((app) => app.route)).size).toBe(SHELL_APPS.length);
    expect(new Set(SHELL_APPS.map((app) => app.repo)).size).toBe(SHELL_APPS.length);
  });

  it('resolves an app from a platform path', () => {
    expect(appFromPath('/hrm/employees').repo).toBe('noah-hrm');
    expect(appFromPath('/apps/navigation').repo).toBe('noah-apps');
  });

  it('falls back to portal for an unknown path', () => {
    expect(appFromPath('/unknown').repo).toBe('noah-portal');
  });

  it('looks up the platform route by repo', () => {
    expect(appByRepo('noah-approval')?.route).toBe('approval');
    expect(appByRepo('missing')).toBeUndefined();
  });
});
