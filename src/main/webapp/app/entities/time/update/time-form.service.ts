import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITime, NewTime } from '../time.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITime for edit and NewTimeFormGroupInput for create.
 */
type TimeFormGroupInput = ITime | PartialWithRequiredKeyOf<NewTime>;

type TimeFormDefaults = Pick<NewTime, 'id' | 'partidas'>;

type TimeFormGroupContent = {
  id: FormControl<ITime['id'] | NewTime['id']>;
  nome: FormControl<ITime['nome']>;
  cidade: FormControl<ITime['cidade']>;
  vitorias: FormControl<ITime['vitorias']>;
  derrotas: FormControl<ITime['derrotas']>;
  empates: FormControl<ITime['empates']>;
  partidas: FormControl<ITime['partidas']>;
};

export type TimeFormGroup = FormGroup<TimeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TimeFormService {
  createTimeFormGroup(time: TimeFormGroupInput = { id: null }): TimeFormGroup {
    const timeRawValue = {
      ...this.getFormDefaults(),
      ...time,
    };
    return new FormGroup<TimeFormGroupContent>({
      id: new FormControl(
        { value: timeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(timeRawValue.nome, {
        validators: [Validators.required],
      }),
      cidade: new FormControl(timeRawValue.cidade),
      vitorias: new FormControl(timeRawValue.vitorias),
      derrotas: new FormControl(timeRawValue.derrotas),
      empates: new FormControl(timeRawValue.empates),
      partidas: new FormControl(timeRawValue.partidas ?? []),
    });
  }

  getTime(form: TimeFormGroup): ITime | NewTime {
    return form.getRawValue() as ITime | NewTime;
  }

  resetForm(form: TimeFormGroup, time: TimeFormGroupInput): void {
    const timeRawValue = { ...this.getFormDefaults(), ...time };
    form.reset(
      {
        ...timeRawValue,
        id: { value: timeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TimeFormDefaults {
    return {
      id: null,
      partidas: [],
    };
  }
}
