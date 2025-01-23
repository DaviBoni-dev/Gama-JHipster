import { IEstatistica, NewEstatistica } from './estatistica.model';

export const sampleWithRequiredData: IEstatistica = {
  id: 20955,
};

export const sampleWithPartialData: IEstatistica = {
  id: 12578,
  rebotes: 9484,
  faltas: 15342,
};

export const sampleWithFullData: IEstatistica = {
  id: 17751,
  pontos: 8600,
  rebotes: 18587,
  assistencias: 5549,
  faltas: 31028,
};

export const sampleWithNewData: NewEstatistica = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
