import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJogador } from '../jogador.model';
import { JogadorService } from '../service/jogador.service';

const jogadorResolve = (route: ActivatedRouteSnapshot): Observable<null | IJogador> => {
  const id = route.params.id;
  if (id) {
    return inject(JogadorService)
      .find(id)
      .pipe(
        mergeMap((jogador: HttpResponse<IJogador>) => {
          if (jogador.body) {
            return of(jogador.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default jogadorResolve;
