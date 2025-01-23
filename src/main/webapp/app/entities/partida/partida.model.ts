import dayjs from 'dayjs/esm';
import { ITime } from 'app/entities/time/time.model';
import { ICampeonato } from 'app/entities/campeonato/campeonato.model';

export interface IPartida {
  id: number;
  data?: dayjs.Dayjs | null;
  local?: string | null;
  pontuacaoTime1?: number | null;
  pontuacaoTime2?: number | null;
  times?: ITime[] | null;
  campeonato?: ICampeonato | null;
}

export type NewPartida = Omit<IPartida, 'id'> & { id: null };
