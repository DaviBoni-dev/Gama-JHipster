import { ITime, NewTime } from './time.model';

export const sampleWithRequiredData: ITime = {
  id: 19086,
  nome: 'earth filter duh',
};

export const sampleWithPartialData: ITime = {
  id: 27818,
  nome: 'aha merit',
  empates: 259,
};

export const sampleWithFullData: ITime = {
  id: 3514,
  nome: 'not until repeatedly',
  cidade: 'whoever ultimately',
  vitorias: 14791,
  derrotas: 6808,
  empates: 4333,
};

export const sampleWithNewData: NewTime = {
  nome: 'till',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
