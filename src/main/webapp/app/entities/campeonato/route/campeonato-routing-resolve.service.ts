import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICampeonato } from '../campeonato.model';
import { CampeonatoService } from '../service/campeonato.service';

const campeonatoResolve = (route: ActivatedRouteSnapshot): Observable<null | ICampeonato> => {
  const id = route.params.id;
  if (id) {
    return inject(CampeonatoService)
      .find(id)
      .pipe(
        mergeMap((campeonato: HttpResponse<ICampeonato>) => {
          if (campeonato.body) {
            return of(campeonato.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default campeonatoResolve;
