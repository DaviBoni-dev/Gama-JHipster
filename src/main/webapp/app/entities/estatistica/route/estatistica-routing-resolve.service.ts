import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstatistica } from '../estatistica.model';
import { EstatisticaService } from '../service/estatistica.service';

const estatisticaResolve = (route: ActivatedRouteSnapshot): Observable<null | IEstatistica> => {
  const id = route.params.id;
  if (id) {
    return inject(EstatisticaService)
      .find(id)
      .pipe(
        mergeMap((estatistica: HttpResponse<IEstatistica>) => {
          if (estatistica.body) {
            return of(estatistica.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default estatisticaResolve;
