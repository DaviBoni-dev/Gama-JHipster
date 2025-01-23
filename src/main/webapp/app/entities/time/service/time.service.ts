import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITime, NewTime } from '../time.model';

export type PartialUpdateTime = Partial<ITime> & Pick<ITime, 'id'>;

export type EntityResponseType = HttpResponse<ITime>;
export type EntityArrayResponseType = HttpResponse<ITime[]>;

@Injectable({ providedIn: 'root' })
export class TimeService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/times');

  create(time: NewTime): Observable<EntityResponseType> {
    return this.http.post<ITime>(this.resourceUrl, time, { observe: 'response' });
  }

  update(time: ITime): Observable<EntityResponseType> {
    return this.http.put<ITime>(`${this.resourceUrl}/${this.getTimeIdentifier(time)}`, time, { observe: 'response' });
  }

  partialUpdate(time: PartialUpdateTime): Observable<EntityResponseType> {
    return this.http.patch<ITime>(`${this.resourceUrl}/${this.getTimeIdentifier(time)}`, time, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITime>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITime[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTimeIdentifier(time: Pick<ITime, 'id'>): number {
    return time.id;
  }

  compareTime(o1: Pick<ITime, 'id'> | null, o2: Pick<ITime, 'id'> | null): boolean {
    return o1 && o2 ? this.getTimeIdentifier(o1) === this.getTimeIdentifier(o2) : o1 === o2;
  }

  addTimeToCollectionIfMissing<Type extends Pick<ITime, 'id'>>(
    timeCollection: Type[],
    ...timesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const times: Type[] = timesToCheck.filter(isPresent);
    if (times.length > 0) {
      const timeCollectionIdentifiers = timeCollection.map(timeItem => this.getTimeIdentifier(timeItem));
      const timesToAdd = times.filter(timeItem => {
        const timeIdentifier = this.getTimeIdentifier(timeItem);
        if (timeCollectionIdentifiers.includes(timeIdentifier)) {
          return false;
        }
        timeCollectionIdentifiers.push(timeIdentifier);
        return true;
      });
      return [...timesToAdd, ...timeCollection];
    }
    return timeCollection;
  }
}
