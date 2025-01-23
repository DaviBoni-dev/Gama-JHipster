import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'time',
    data: { pageTitle: 'Times' },
    loadChildren: () => import('./time/time.routes'),
  },
  {
    path: 'jogador',
    data: { pageTitle: 'Jogadors' },
    loadChildren: () => import('./jogador/jogador.routes'),
  },
  {
    path: 'partida',
    data: { pageTitle: 'Partidas' },
    loadChildren: () => import('./partida/partida.routes'),
  },
  {
    path: 'estatistica',
    data: { pageTitle: 'Estatisticas' },
    loadChildren: () => import('./estatistica/estatistica.routes'),
  },
  {
    path: 'campeonato',
    data: { pageTitle: 'Campeonatoes' },
    loadChildren: () => import('./campeonato/campeonato.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
