import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../time.test-samples';

import { TimeFormService } from './time-form.service';

describe('Time Form Service', () => {
  let service: TimeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeFormService);
  });

  describe('Service methods', () => {
    describe('createTimeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTimeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            cidade: expect.any(Object),
            vitorias: expect.any(Object),
            derrotas: expect.any(Object),
            empates: expect.any(Object),
            partidas: expect.any(Object),
          }),
        );
      });

      it('passing ITime should create a new form with FormGroup', () => {
        const formGroup = service.createTimeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            cidade: expect.any(Object),
            vitorias: expect.any(Object),
            derrotas: expect.any(Object),
            empates: expect.any(Object),
            partidas: expect.any(Object),
          }),
        );
      });
    });

    describe('getTime', () => {
      it('should return NewTime for default Time initial value', () => {
        const formGroup = service.createTimeFormGroup(sampleWithNewData);

        const time = service.getTime(formGroup) as any;

        expect(time).toMatchObject(sampleWithNewData);
      });

      it('should return NewTime for empty Time initial value', () => {
        const formGroup = service.createTimeFormGroup();

        const time = service.getTime(formGroup) as any;

        expect(time).toMatchObject({});
      });

      it('should return ITime', () => {
        const formGroup = service.createTimeFormGroup(sampleWithRequiredData);

        const time = service.getTime(formGroup) as any;

        expect(time).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITime should not enable id FormControl', () => {
        const formGroup = service.createTimeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTime should disable id FormControl', () => {
        const formGroup = service.createTimeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
