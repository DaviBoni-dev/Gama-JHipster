import dayjs from 'dayjs/esm';

import { ICampeonato, NewCampeonato } from './campeonato.model';

export const sampleWithRequiredData: ICampeonato = {
  id: 2208,
  nome: 'internationalize',
};

export const sampleWithPartialData: ICampeonato = {
  id: 10109,
  nome: 'alongside drive far',
  dataInicio: dayjs('2025-01-22'),
  dataFim: dayjs('2025-01-22'),
};

export const sampleWithFullData: ICampeonato = {
  id: 32167,
  nome: 'nerve pleasant',
  descricao: 'angrily',
  dataInicio: dayjs('2025-01-22'),
  dataFim: dayjs('2025-01-22'),
};

export const sampleWithNewData: NewCampeonato = {
  nome: 'acidly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
