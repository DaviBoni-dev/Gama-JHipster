import dayjs from 'dayjs/esm';

import { IPartida, NewPartida } from './partida.model';

export const sampleWithRequiredData: IPartida = {
  id: 28210,
  data: dayjs('2025-01-22'),
};

export const sampleWithPartialData: IPartida = {
  id: 2501,
  data: dayjs('2025-01-22'),
  pontuacaoTime1: 27722,
  pontuacaoTime2: 10358,
};

export const sampleWithFullData: IPartida = {
  id: 21164,
  data: dayjs('2025-01-22'),
  local: 'ugh',
  pontuacaoTime1: 12225,
  pontuacaoTime2: 1156,
};

export const sampleWithNewData: NewPartida = {
  data: dayjs('2025-01-22'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
