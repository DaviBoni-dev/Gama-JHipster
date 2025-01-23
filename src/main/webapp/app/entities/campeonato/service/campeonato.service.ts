import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICampeonato, NewCampeonato } from '../campeonato.model';

export type PartialUpdateCampeonato = Partial<ICampeonato> & Pick<ICampeonato, 'id'>;

type RestOf<T extends ICampeonato | NewCampeonato> = Omit<T, 'dataInicio' | 'dataFim'> & {
  dataInicio?: string | null;
  dataFim?: string | null;
};

export type RestCampeonato = RestOf<ICampeonato>;

export type NewRestCampeonato = RestOf<NewCampeonato>;

export type PartialUpdateRestCampeonato = RestOf<PartialUpdateCampeonato>;

export type EntityResponseType = HttpResponse<ICampeonato>;
export type EntityArrayResponseType = HttpResponse<ICampeonato[]>;

@Injectable({ providedIn: 'root' })
export class CampeonatoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/campeonatoes');

  create(campeonato: NewCampeonato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campeonato);
    return this.http
      .post<RestCampeonato>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(campeonato: ICampeonato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campeonato);
    return this.http
      .put<RestCampeonato>(`${this.resourceUrl}/${this.getCampeonatoIdentifier(campeonato)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(campeonato: PartialUpdateCampeonato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(campeonato);
    return this.http
      .patch<RestCampeonato>(`${this.resourceUrl}/${this.getCampeonatoIdentifier(campeonato)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCampeonato>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCampeonato[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCampeonatoIdentifier(campeonato: Pick<ICampeonato, 'id'>): number {
    return campeonato.id;
  }

  compareCampeonato(o1: Pick<ICampeonato, 'id'> | null, o2: Pick<ICampeonato, 'id'> | null): boolean {
    return o1 && o2 ? this.getCampeonatoIdentifier(o1) === this.getCampeonatoIdentifier(o2) : o1 === o2;
  }

  addCampeonatoToCollectionIfMissing<Type extends Pick<ICampeonato, 'id'>>(
    campeonatoCollection: Type[],
    ...campeonatoesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const campeonatoes: Type[] = campeonatoesToCheck.filter(isPresent);
    if (campeonatoes.length > 0) {
      const campeonatoCollectionIdentifiers = campeonatoCollection.map(campeonatoItem => this.getCampeonatoIdentifier(campeonatoItem));
      const campeonatoesToAdd = campeonatoes.filter(campeonatoItem => {
        const campeonatoIdentifier = this.getCampeonatoIdentifier(campeonatoItem);
        if (campeonatoCollectionIdentifiers.includes(campeonatoIdentifier)) {
          return false;
        }
        campeonatoCollectionIdentifiers.push(campeonatoIdentifier);
        return true;
      });
      return [...campeonatoesToAdd, ...campeonatoCollection];
    }
    return campeonatoCollection;
  }

  protected convertDateFromClient<T extends ICampeonato | NewCampeonato | PartialUpdateCampeonato>(campeonato: T): RestOf<T> {
    return {
      ...campeonato,
      dataInicio: campeonato.dataInicio?.format(DATE_FORMAT) ?? null,
      dataFim: campeonato.dataFim?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restCampeonato: RestCampeonato): ICampeonato {
    return {
      ...restCampeonato,
      dataInicio: restCampeonato.dataInicio ? dayjs(restCampeonato.dataInicio) : undefined,
      dataFim: restCampeonato.dataFim ? dayjs(restCampeonato.dataFim) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCampeonato>): HttpResponse<ICampeonato> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCampeonato[]>): HttpResponse<ICampeonato[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
