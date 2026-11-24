import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { RemoteErrorComponent } from './shell/remote-error.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'portal' },
  remote('portal', 'noah-portal'),
  remote('hrm', 'noah-hrm'),
  remote('notice', 'noah-notice'),
  remote('notify', 'noah-notify'),
  remote('docs', 'noah-docs'),
  remote('calendar', 'noah-calendar'),
  remote('account', 'noah-account'),
  remote('apps', 'noah-apps'),
  remote('crm', 'noah-crm'),
  remote('erp', 'noah-erp'),
  remote('itsm', 'noah-itsm'),
  remote('lms', 'noah-lms'),
  remote('approval', 'noah-approval'),
  remote('affairs', 'noah-affairs'),
  remote('payroll', 'noah-payroll'),
  remote('project', 'noah-project'),
  { path: '**', redirectTo: 'portal' },
];

interface RemoteRouteModule {
  remoteRoutes: Routes;
}

function remote(path: string, name: string): Routes[number] {
  return {
    path,
    loadChildren: () => loadRemoteModule<RemoteRouteModule>(name, './routes')
      .then((module) => module.remoteRoutes)
      .catch((): Routes => [{ path: '**', component: RemoteErrorComponent, data: { app: name } }]),
  };
}
