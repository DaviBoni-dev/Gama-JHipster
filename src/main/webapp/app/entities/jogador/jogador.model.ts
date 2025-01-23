import { ITime } from 'app/entities/time/time.model';

export interface IJogador {
  id: number;
  nome?: string | null;
  posicao?: string | null;
  numeroCamisa?: number | null;
  time?: ITime | null;
}

export type NewJogador = Omit<IJogador, 'id'> & { id: null };
