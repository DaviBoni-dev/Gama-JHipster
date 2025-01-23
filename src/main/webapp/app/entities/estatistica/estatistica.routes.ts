import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EstatisticaResolve from './route/estatistica-routing-resolve.service';

const estatisticaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/estatistica.component').then(m => m.EstatisticaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/estatistica-detail.component').then(m => m.EstatisticaDetailComponent),
    resolve: {
      estatistica: EstatisticaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/estatistica-update.component').then(m => m.EstatisticaUpdateComponent),
    resolve: {
      estatistica: EstatisticaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/estatistica-update.component').then(m => m.EstatisticaUpdateComponent),
    resolve: {
      estatistica: EstatisticaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default estatisticaRoute;
