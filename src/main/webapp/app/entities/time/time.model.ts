import { IPartida } from 'app/entities/partida/partida.model';

export interface ITime {
  id: number;
  nome?: string | null;
  cidade?: string | null;
  vitorias?: number | null;
  derrotas?: number | null;
  empates?: number | null;
  partidas?: IPartida[] | null;
}

export type NewTime = Omit<ITime, 'id'> & { id: null };
