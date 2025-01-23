import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJogador, NewJogador } from '../jogador.model';

export type PartialUpdateJogador = Partial<IJogador> & Pick<IJogador, 'id'>;

export type EntityResponseType = HttpResponse<IJogador>;
export type EntityArrayResponseType = HttpResponse<IJogador[]>;

@Injectable({ providedIn: 'root' })
export class JogadorService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/jogadors');

  create(jogador: NewJogador): Observable<EntityResponseType> {
    return this.http.post<IJogador>(this.resourceUrl, jogador, { observe: 'response' });
  }

  update(jogador: IJogador): Observable<EntityResponseType> {
    return this.http.put<IJogador>(`${this.resourceUrl}/${this.getJogadorIdentifier(jogador)}`, jogador, { observe: 'response' });
  }

  partialUpdate(jogador: PartialUpdateJogador): Observable<EntityResponseType> {
    return this.http.patch<IJogador>(`${this.resourceUrl}/${this.getJogadorIdentifier(jogador)}`, jogador, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJogador>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJogador[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJogadorIdentifier(jogador: Pick<IJogador, 'id'>): number {
    return jogador.id;
  }

  compareJogador(o1: Pick<IJogador, 'id'> | null, o2: Pick<IJogador, 'id'> | null): boolean {
    return o1 && o2 ? this.getJogadorIdentifier(o1) === this.getJogadorIdentifier(o2) : o1 === o2;
  }

  addJogadorToCollectionIfMissing<Type extends Pick<IJogador, 'id'>>(
    jogadorCollection: Type[],
    ...jogadorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jogadors: Type[] = jogadorsToCheck.filter(isPresent);
    if (jogadors.length > 0) {
      const jogadorCollectionIdentifiers = jogadorCollection.map(jogadorItem => this.getJogadorIdentifier(jogadorItem));
      const jogadorsToAdd = jogadors.filter(jogadorItem => {
        const jogadorIdentifier = this.getJogadorIdentifier(jogadorItem);
        if (jogadorCollectionIdentifiers.includes(jogadorIdentifier)) {
          return false;
        }
        jogadorCollectionIdentifiers.push(jogadorIdentifier);
        return true;
      });
      return [...jogadorsToAdd, ...jogadorCollection];
    }
    return jogadorCollection;
  }
}
