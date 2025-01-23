import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../jogador.test-samples';

import { JogadorFormService } from './jogador-form.service';

describe('Jogador Form Service', () => {
  let service: JogadorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JogadorFormService);
  });

  describe('Service methods', () => {
    describe('createJogadorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJogadorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            posicao: expect.any(Object),
            numeroCamisa: expect.any(Object),
            time: expect.any(Object),
          }),
        );
      });

      it('passing IJogador should create a new form with FormGroup', () => {
        const formGroup = service.createJogadorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            posicao: expect.any(Object),
            numeroCamisa: expect.any(Object),
            time: expect.any(Object),
          }),
        );
      });
    });

    describe('getJogador', () => {
      it('should return NewJogador for default Jogador initial value', () => {
        const formGroup = service.createJogadorFormGroup(sampleWithNewData);

        const jogador = service.getJogador(formGroup) as any;

        expect(jogador).toMatchObject(sampleWithNewData);
      });

      it('should return NewJogador for empty Jogador initial value', () => {
        const formGroup = service.createJogadorFormGroup();

        const jogador = service.getJogador(formGroup) as any;

        expect(jogador).toMatchObject({});
      });

      it('should return IJogador', () => {
        const formGroup = service.createJogadorFormGroup(sampleWithRequiredData);

        const jogador = service.getJogador(formGroup) as any;

        expect(jogador).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJogador should not enable id FormControl', () => {
        const formGroup = service.createJogadorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJogador should disable id FormControl', () => {
        const formGroup = service.createJogadorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
