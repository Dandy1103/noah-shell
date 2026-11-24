export interface ShellAppManifest {
  repo: string;
  route: string;
  label: string;
}

export const SHELL_APPS: readonly ShellAppManifest[] = [
  { repo: 'noah-portal', route: 'portal', label: '入口' },
  { repo: 'noah-hrm', route: 'hrm', label: '人資管理' },
  { repo: 'noah-notice', route: 'notice', label: '公告' },
  { repo: 'noah-notify', route: 'notify', label: '通知' },
  { repo: 'noah-docs', route: 'docs', label: '文件' },
  { repo: 'noah-calendar', route: 'calendar', label: '行事曆' },
  { repo: 'noah-account', route: 'account', label: '帳號管理' },
  { repo: 'noah-apps', route: 'apps', label: '應用管理' },
  { repo: 'noah-crm', route: 'crm', label: '客戶關係' },
  { repo: 'noah-erp', route: 'erp', label: '財務會計' },
  { repo: 'noah-itsm', route: 'itsm', label: '資訊服務' },
  { repo: 'noah-lms', route: 'lms', label: '教育訓練' },
  { repo: 'noah-approval', route: 'approval', label: '簽核' },
  { repo: 'noah-affairs', route: 'affairs', label: '總務行政' },
  { repo: 'noah-payroll', route: 'payroll', label: '薪資' },
  { repo: 'noah-project', route: 'project', label: '專案管理' },
];

export function appFromPath(pathname: string): ShellAppManifest {
  const route = pathname.replace(/^\/+/, '').split('/')[0];
  return SHELL_APPS.find((app) => app.route === route) ?? SHELL_APPS[0];
}

export function appByRepo(repo: string | null): ShellAppManifest | undefined {
  return SHELL_APPS.find((app) => app.repo === repo);
}
