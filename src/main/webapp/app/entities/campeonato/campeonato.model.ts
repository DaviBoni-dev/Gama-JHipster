import dayjs from 'dayjs/esm';

export interface ICampeonato {
  id: number;
  nome?: string | null;
  descricao?: string | null;
  dataInicio?: dayjs.Dayjs | null;
  dataFim?: dayjs.Dayjs | null;
}

export type NewCampeonato = Omit<ICampeonato, 'id'> & { id: null };
