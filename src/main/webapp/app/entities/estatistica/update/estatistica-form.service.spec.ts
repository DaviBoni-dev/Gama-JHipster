import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../estatistica.test-samples';

import { EstatisticaFormService } from './estatistica-form.service';

describe('Estatistica Form Service', () => {
  let service: EstatisticaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstatisticaFormService);
  });

  describe('Service methods', () => {
    describe('createEstatisticaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEstatisticaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            pontos: expect.any(Object),
            rebotes: expect.any(Object),
            assistencias: expect.any(Object),
            faltas: expect.any(Object),
            jogador: expect.any(Object),
            partida: expect.any(Object),
          }),
        );
      });

      it('passing IEstatistica should create a new form with FormGroup', () => {
        const formGroup = service.createEstatisticaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            pontos: expect.any(Object),
            rebotes: expect.any(Object),
            assistencias: expect.any(Object),
            faltas: expect.any(Object),
            jogador: expect.any(Object),
            partida: expect.any(Object),
          }),
        );
      });
    });

    describe('getEstatistica', () => {
      it('should return NewEstatistica for default Estatistica initial value', () => {
        const formGroup = service.createEstatisticaFormGroup(sampleWithNewData);

        const estatistica = service.getEstatistica(formGroup) as any;

        expect(estatistica).toMatchObject(sampleWithNewData);
      });

      it('should return NewEstatistica for empty Estatistica initial value', () => {
        const formGroup = service.createEstatisticaFormGroup();

        const estatistica = service.getEstatistica(formGroup) as any;

        expect(estatistica).toMatchObject({});
      });

      it('should return IEstatistica', () => {
        const formGroup = service.createEstatisticaFormGroup(sampleWithRequiredData);

        const estatistica = service.getEstatistica(formGroup) as any;

        expect(estatistica).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEstatistica should not enable id FormControl', () => {
        const formGroup = service.createEstatisticaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEstatistica should disable id FormControl', () => {
        const formGroup = service.createEstatisticaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
