import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstatistica, NewEstatistica } from '../estatistica.model';

export type PartialUpdateEstatistica = Partial<IEstatistica> & Pick<IEstatistica, 'id'>;

export type EntityResponseType = HttpResponse<IEstatistica>;
export type EntityArrayResponseType = HttpResponse<IEstatistica[]>;

@Injectable({ providedIn: 'root' })
export class EstatisticaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estatisticas');

  create(estatistica: NewEstatistica): Observable<EntityResponseType> {
    return this.http.post<IEstatistica>(this.resourceUrl, estatistica, { observe: 'response' });
  }

  update(estatistica: IEstatistica): Observable<EntityResponseType> {
    return this.http.put<IEstatistica>(`${this.resourceUrl}/${this.getEstatisticaIdentifier(estatistica)}`, estatistica, {
      observe: 'response',
    });
  }

  partialUpdate(estatistica: PartialUpdateEstatistica): Observable<EntityResponseType> {
    return this.http.patch<IEstatistica>(`${this.resourceUrl}/${this.getEstatisticaIdentifier(estatistica)}`, estatistica, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstatistica>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstatistica[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEstatisticaIdentifier(estatistica: Pick<IEstatistica, 'id'>): number {
    return estatistica.id;
  }

  compareEstatistica(o1: Pick<IEstatistica, 'id'> | null, o2: Pick<IEstatistica, 'id'> | null): boolean {
    return o1 && o2 ? this.getEstatisticaIdentifier(o1) === this.getEstatisticaIdentifier(o2) : o1 === o2;
  }

  addEstatisticaToCollectionIfMissing<Type extends Pick<IEstatistica, 'id'>>(
    estatisticaCollection: Type[],
    ...estatisticasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const estatisticas: Type[] = estatisticasToCheck.filter(isPresent);
    if (estatisticas.length > 0) {
      const estatisticaCollectionIdentifiers = estatisticaCollection.map(estatisticaItem => this.getEstatisticaIdentifier(estatisticaItem));
      const estatisticasToAdd = estatisticas.filter(estatisticaItem => {
        const estatisticaIdentifier = this.getEstatisticaIdentifier(estatisticaItem);
        if (estatisticaCollectionIdentifiers.includes(estatisticaIdentifier)) {
          return false;
        }
        estatisticaCollectionIdentifiers.push(estatisticaIdentifier);
        return true;
      });
      return [...estatisticasToAdd, ...estatisticaCollection];
    }
    return estatisticaCollection;
  }
}
