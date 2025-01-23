import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import JogadorResolve from './route/jogador-routing-resolve.service';

const jogadorRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/jogador.component').then(m => m.JogadorComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/jogador-detail.component').then(m => m.JogadorDetailComponent),
    resolve: {
      jogador: JogadorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/jogador-update.component').then(m => m.JogadorUpdateComponent),
    resolve: {
      jogador: JogadorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/jogador-update.component').then(m => m.JogadorUpdateComponent),
    resolve: {
      jogador: JogadorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jogadorRoute;
