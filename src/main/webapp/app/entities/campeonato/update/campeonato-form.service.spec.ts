import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../campeonato.test-samples';

import { CampeonatoFormService } from './campeonato-form.service';

describe('Campeonato Form Service', () => {
  let service: CampeonatoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampeonatoFormService);
  });

  describe('Service methods', () => {
    describe('createCampeonatoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCampeonatoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
            dataInicio: expect.any(Object),
            dataFim: expect.any(Object),
          }),
        );
      });

      it('passing ICampeonato should create a new form with FormGroup', () => {
        const formGroup = service.createCampeonatoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
            dataInicio: expect.any(Object),
            dataFim: expect.any(Object),
          }),
        );
      });
    });

    describe('getCampeonato', () => {
      it('should return NewCampeonato for default Campeonato initial value', () => {
        const formGroup = service.createCampeonatoFormGroup(sampleWithNewData);

        const campeonato = service.getCampeonato(formGroup) as any;

        expect(campeonato).toMatchObject(sampleWithNewData);
      });

      it('should return NewCampeonato for empty Campeonato initial value', () => {
        const formGroup = service.createCampeonatoFormGroup();

        const campeonato = service.getCampeonato(formGroup) as any;

        expect(campeonato).toMatchObject({});
      });

      it('should return ICampeonato', () => {
        const formGroup = service.createCampeonatoFormGroup(sampleWithRequiredData);

        const campeonato = service.getCampeonato(formGroup) as any;

        expect(campeonato).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICampeonato should not enable id FormControl', () => {
        const formGroup = service.createCampeonatoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCampeonato should disable id FormControl', () => {
        const formGroup = service.createCampeonatoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
