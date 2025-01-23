import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../partida.test-samples';

import { PartidaFormService } from './partida-form.service';

describe('Partida Form Service', () => {
  let service: PartidaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidaFormService);
  });

  describe('Service methods', () => {
    describe('createPartidaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPartidaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            data: expect.any(Object),
            local: expect.any(Object),
            pontuacaoTime1: expect.any(Object),
            pontuacaoTime2: expect.any(Object),
            times: expect.any(Object),
            campeonato: expect.any(Object),
          }),
        );
      });

      it('passing IPartida should create a new form with FormGroup', () => {
        const formGroup = service.createPartidaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            data: expect.any(Object),
            local: expect.any(Object),
            pontuacaoTime1: expect.any(Object),
            pontuacaoTime2: expect.any(Object),
            times: expect.any(Object),
            campeonato: expect.any(Object),
          }),
        );
      });
    });

    describe('getPartida', () => {
      it('should return NewPartida for default Partida initial value', () => {
        const formGroup = service.createPartidaFormGroup(sampleWithNewData);

        const partida = service.getPartida(formGroup) as any;

        expect(partida).toMatchObject(sampleWithNewData);
      });

      it('should return NewPartida for empty Partida initial value', () => {
        const formGroup = service.createPartidaFormGroup();

        const partida = service.getPartida(formGroup) as any;

        expect(partida).toMatchObject({});
      });

      it('should return IPartida', () => {
        const formGroup = service.createPartidaFormGroup(sampleWithRequiredData);

        const partida = service.getPartida(formGroup) as any;

        expect(partida).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPartida should not enable id FormControl', () => {
        const formGroup = service.createPartidaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPartida should disable id FormControl', () => {
        const formGroup = service.createPartidaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
