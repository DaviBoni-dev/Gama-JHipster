import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPartida } from '../partida.model';
import { PartidaService } from '../service/partida.service';

const partidaResolve = (route: ActivatedRouteSnapshot): Observable<null | IPartida> => {
  const id = route.params.id;
  if (id) {
    return inject(PartidaService)
      .find(id)
      .pipe(
        mergeMap((partida: HttpResponse<IPartida>) => {
          if (partida.body) {
            return of(partida.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default partidaResolve;
