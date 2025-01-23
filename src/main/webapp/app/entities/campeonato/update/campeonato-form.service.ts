import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ICampeonato, NewCampeonato } from '../campeonato.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICampeonato for edit and NewCampeonatoFormGroupInput for create.
 */
type CampeonatoFormGroupInput = ICampeonato | PartialWithRequiredKeyOf<NewCampeonato>;

type CampeonatoFormDefaults = Pick<NewCampeonato, 'id'>;

type CampeonatoFormGroupContent = {
  id: FormControl<ICampeonato['id'] | NewCampeonato['id']>;
  nome: FormControl<ICampeonato['nome']>;
  descricao: FormControl<ICampeonato['descricao']>;
  dataInicio: FormControl<ICampeonato['dataInicio']>;
  dataFim: FormControl<ICampeonato['dataFim']>;
};

export type CampeonatoFormGroup = FormGroup<CampeonatoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CampeonatoFormService {
  createCampeonatoFormGroup(campeonato: CampeonatoFormGroupInput = { id: null }): CampeonatoFormGroup {
    const campeonatoRawValue = {
      ...this.getFormDefaults(),
      ...campeonato,
    };
    return new FormGroup<CampeonatoFormGroupContent>({
      id: new FormControl(
        { value: campeonatoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(campeonatoRawValue.nome, {
        validators: [Validators.required],
      }),
      descricao: new FormControl(campeonatoRawValue.descricao, {
        validators: [Validators.maxLength(1000)],
      }),
      dataInicio: new FormControl(campeonatoRawValue.dataInicio),
      dataFim: new FormControl(campeonatoRawValue.dataFim),
    });
  }

  getCampeonato(form: CampeonatoFormGroup): ICampeonato | NewCampeonato {
    return form.getRawValue() as ICampeonato | NewCampeonato;
  }

  resetForm(form: CampeonatoFormGroup, campeonato: CampeonatoFormGroupInput): void {
    const campeonatoRawValue = { ...this.getFormDefaults(), ...campeonato };
    form.reset(
      {
        ...campeonatoRawValue,
        id: { value: campeonatoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CampeonatoFormDefaults {
    return {
      id: null,
    };
  }
}
