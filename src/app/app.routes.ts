import { Routes } from '@angular/router';
import { AppOutletComponent } from './shell/app-outlet.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'portal' },
  { path: '**', component: AppOutletComponent },
];
