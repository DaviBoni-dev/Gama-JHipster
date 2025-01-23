import { IJogador } from 'app/entities/jogador/jogador.model';
import { IPartida } from 'app/entities/partida/partida.model';

export interface IEstatistica {
  id: number;
  pontos?: number | null;
  rebotes?: number | null;
  assistencias?: number | null;
  faltas?: number | null;
  jogador?: IJogador | null;
  partida?: IPartida | null;
}

export type NewEstatistica = Omit<IEstatistica, 'id'> & { id: null };
