import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITime } from '../time.model';
import { TimeService } from '../service/time.service';

const timeResolve = (route: ActivatedRouteSnapshot): Observable<null | ITime> => {
  const id = route.params.id;
  if (id) {
    return inject(TimeService)
      .find(id)
      .pipe(
        mergeMap((time: HttpResponse<ITime>) => {
          if (time.body) {
            return of(time.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default timeResolve;
