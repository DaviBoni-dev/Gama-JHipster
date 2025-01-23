import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IEstatistica, NewEstatistica } from '../estatistica.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEstatistica for edit and NewEstatisticaFormGroupInput for create.
 */
type EstatisticaFormGroupInput = IEstatistica | PartialWithRequiredKeyOf<NewEstatistica>;

type EstatisticaFormDefaults = Pick<NewEstatistica, 'id'>;

type EstatisticaFormGroupContent = {
  id: FormControl<IEstatistica['id'] | NewEstatistica['id']>;
  pontos: FormControl<IEstatistica['pontos']>;
  rebotes: FormControl<IEstatistica['rebotes']>;
  assistencias: FormControl<IEstatistica['assistencias']>;
  faltas: FormControl<IEstatistica['faltas']>;
  jogador: FormControl<IEstatistica['jogador']>;
  partida: FormControl<IEstatistica['partida']>;
};

export type EstatisticaFormGroup = FormGroup<EstatisticaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EstatisticaFormService {
  createEstatisticaFormGroup(estatistica: EstatisticaFormGroupInput = { id: null }): EstatisticaFormGroup {
    const estatisticaRawValue = {
      ...this.getFormDefaults(),
      ...estatistica,
    };
    return new FormGroup<EstatisticaFormGroupContent>({
      id: new FormControl(
        { value: estatisticaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      pontos: new FormControl(estatisticaRawValue.pontos),
      rebotes: new FormControl(estatisticaRawValue.rebotes),
      assistencias: new FormControl(estatisticaRawValue.assistencias),
      faltas: new FormControl(estatisticaRawValue.faltas),
      jogador: new FormControl(estatisticaRawValue.jogador),
      partida: new FormControl(estatisticaRawValue.partida),
    });
  }

  getEstatistica(form: EstatisticaFormGroup): IEstatistica | NewEstatistica {
    return form.getRawValue() as IEstatistica | NewEstatistica;
  }

  resetForm(form: EstatisticaFormGroup, estatistica: EstatisticaFormGroupInput): void {
    const estatisticaRawValue = { ...this.getFormDefaults(), ...estatistica };
    form.reset(
      {
        ...estatisticaRawValue,
        id: { value: estatisticaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EstatisticaFormDefaults {
    return {
      id: null,
    };
  }
}
