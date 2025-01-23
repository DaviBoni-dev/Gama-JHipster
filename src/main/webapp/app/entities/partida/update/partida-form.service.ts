import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPartida, NewPartida } from '../partida.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPartida for edit and NewPartidaFormGroupInput for create.
 */
type PartidaFormGroupInput = IPartida | PartialWithRequiredKeyOf<NewPartida>;

type PartidaFormDefaults = Pick<NewPartida, 'id' | 'times'>;

type PartidaFormGroupContent = {
  id: FormControl<IPartida['id'] | NewPartida['id']>;
  data: FormControl<IPartida['data']>;
  local: FormControl<IPartida['local']>;
  pontuacaoTime1: FormControl<IPartida['pontuacaoTime1']>;
  pontuacaoTime2: FormControl<IPartida['pontuacaoTime2']>;
  times: FormControl<IPartida['times']>;
  campeonato: FormControl<IPartida['campeonato']>;
};

export type PartidaFormGroup = FormGroup<PartidaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PartidaFormService {
  createPartidaFormGroup(partida: PartidaFormGroupInput = { id: null }): PartidaFormGroup {
    const partidaRawValue = {
      ...this.getFormDefaults(),
      ...partida,
    };
    return new FormGroup<PartidaFormGroupContent>({
      id: new FormControl(
        { value: partidaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      data: new FormControl(partidaRawValue.data, {
        validators: [Validators.required],
      }),
      local: new FormControl(partidaRawValue.local),
      pontuacaoTime1: new FormControl(partidaRawValue.pontuacaoTime1),
      pontuacaoTime2: new FormControl(partidaRawValue.pontuacaoTime2),
      times: new FormControl(partidaRawValue.times ?? []),
      campeonato: new FormControl(partidaRawValue.campeonato),
    });
  }

  getPartida(form: PartidaFormGroup): IPartida | NewPartida {
    return form.getRawValue() as IPartida | NewPartida;
  }

  resetForm(form: PartidaFormGroup, partida: PartidaFormGroupInput): void {
    const partidaRawValue = { ...this.getFormDefaults(), ...partida };
    form.reset(
      {
        ...partidaRawValue,
        id: { value: partidaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PartidaFormDefaults {
    return {
      id: null,
      times: [],
    };
  }
}
