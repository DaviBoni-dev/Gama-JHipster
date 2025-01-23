import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPartida, NewPartida } from '../partida.model';

export type PartialUpdatePartida = Partial<IPartida> & Pick<IPartida, 'id'>;

type RestOf<T extends IPartida | NewPartida> = Omit<T, 'data'> & {
  data?: string | null;
};

export type RestPartida = RestOf<IPartida>;

export type NewRestPartida = RestOf<NewPartida>;

export type PartialUpdateRestPartida = RestOf<PartialUpdatePartida>;

export type EntityResponseType = HttpResponse<IPartida>;
export type EntityArrayResponseType = HttpResponse<IPartida[]>;

@Injectable({ providedIn: 'root' })
export class PartidaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/partidas');

  create(partida: NewPartida): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(partida);
    return this.http
      .post<RestPartida>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(partida: IPartida): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(partida);
    return this.http
      .put<RestPartida>(`${this.resourceUrl}/${this.getPartidaIdentifier(partida)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(partida: PartialUpdatePartida): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(partida);
    return this.http
      .patch<RestPartida>(`${this.resourceUrl}/${this.getPartidaIdentifier(partida)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPartida>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPartida[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPartidaIdentifier(partida: Pick<IPartida, 'id'>): number {
    return partida.id;
  }

  comparePartida(o1: Pick<IPartida, 'id'> | null, o2: Pick<IPartida, 'id'> | null): boolean {
    return o1 && o2 ? this.getPartidaIdentifier(o1) === this.getPartidaIdentifier(o2) : o1 === o2;
  }

  addPartidaToCollectionIfMissing<Type extends Pick<IPartida, 'id'>>(
    partidaCollection: Type[],
    ...partidasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const partidas: Type[] = partidasToCheck.filter(isPresent);
    if (partidas.length > 0) {
      const partidaCollectionIdentifiers = partidaCollection.map(partidaItem => this.getPartidaIdentifier(partidaItem));
      const partidasToAdd = partidas.filter(partidaItem => {
        const partidaIdentifier = this.getPartidaIdentifier(partidaItem);
        if (partidaCollectionIdentifiers.includes(partidaIdentifier)) {
          return false;
        }
        partidaCollectionIdentifiers.push(partidaIdentifier);
        return true;
      });
      return [...partidasToAdd, ...partidaCollection];
    }
    return partidaCollection;
  }

  protected convertDateFromClient<T extends IPartida | NewPartida | PartialUpdatePartida>(partida: T): RestOf<T> {
    return {
      ...partida,
      data: partida.data?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPartida: RestPartida): IPartida {
    return {
      ...restPartida,
      data: restPartida.data ? dayjs(restPartida.data) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPartida>): HttpResponse<IPartida> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPartida[]>): HttpResponse<IPartida[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
