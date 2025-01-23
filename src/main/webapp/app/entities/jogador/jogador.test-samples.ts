import { IJogador, NewJogador } from './jogador.model';

export const sampleWithRequiredData: IJogador = {
  id: 14492,
  nome: 'kissingly upright',
};

export const sampleWithPartialData: IJogador = {
  id: 14262,
  nome: 'where',
  posicao: 'wilderness ouch bolster',
  numeroCamisa: 15896,
};

export const sampleWithFullData: IJogador = {
  id: 27387,
  nome: 'whose afterwards',
  posicao: 'acidic',
  numeroCamisa: 16405,
};

export const sampleWithNewData: NewJogador = {
  nome: 'hmph unto',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
