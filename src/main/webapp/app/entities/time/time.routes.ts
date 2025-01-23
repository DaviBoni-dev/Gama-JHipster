import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TimeResolve from './route/time-routing-resolve.service';

const timeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/time.component').then(m => m.TimeComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/time-detail.component').then(m => m.TimeDetailComponent),
    resolve: {
      time: TimeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/time-update.component').then(m => m.TimeUpdateComponent),
    resolve: {
      time: TimeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/time-update.component').then(m => m.TimeUpdateComponent),
    resolve: {
      time: TimeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default timeRoute;
