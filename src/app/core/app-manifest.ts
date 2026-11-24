export type ShellLayout = 'full' | 'sidebar';

export interface ShellAppManifest {
  repo: string;
  route: string;
  label: string;
  layout: ShellLayout;
}

export const SHELL_APPS: readonly ShellAppManifest[] = [
  { repo: 'noah-portal', route: 'portal', label: '入口', layout: 'full' },
  { repo: 'noah-hrm', route: 'hrm', label: '人資管理', layout: 'sidebar' },
  { repo: 'noah-notice', route: 'notice', label: '公告', layout: 'sidebar' },
  { repo: 'noah-notify', route: 'notify', label: '通知', layout: 'sidebar' },
  { repo: 'noah-docs', route: 'docs', label: '文件', layout: 'sidebar' },
  { repo: 'noah-calendar', route: 'calendar', label: '行事曆', layout: 'sidebar' },
  { repo: 'noah-account', route: 'account', label: '帳號管理', layout: 'sidebar' },
  { repo: 'noah-apps', route: 'apps', label: '應用管理', layout: 'sidebar' },
  { repo: 'noah-crm', route: 'crm', label: '客戶關係', layout: 'sidebar' },
  { repo: 'noah-erp', route: 'erp', label: '財務會計', layout: 'sidebar' },
  { repo: 'noah-itsm', route: 'itsm', label: '資訊服務', layout: 'sidebar' },
  { repo: 'noah-lms', route: 'lms', label: '教育訓練', layout: 'sidebar' },
  { repo: 'noah-approval', route: 'approval', label: '簽核', layout: 'sidebar' },
  { repo: 'noah-affairs', route: 'affairs', label: '總務行政', layout: 'sidebar' },
  { repo: 'noah-payroll', route: 'payroll', label: '薪資', layout: 'sidebar' },
  { repo: 'noah-project', route: 'project', label: '專案管理', layout: 'sidebar' },
];

export function appFromPath(pathname: string): ShellAppManifest {
  const route = pathname.replace(/^\/+/, '').split('/')[0];
  return SHELL_APPS.find((app) => app.route === route) ?? SHELL_APPS[0];
}

export function appByRepo(repo: string | null): ShellAppManifest | undefined {
  return SHELL_APPS.find((app) => app.repo === repo);
}
