import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IJogador, NewJogador } from '../jogador.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJogador for edit and NewJogadorFormGroupInput for create.
 */
type JogadorFormGroupInput = IJogador | PartialWithRequiredKeyOf<NewJogador>;

type JogadorFormDefaults = Pick<NewJogador, 'id'>;

type JogadorFormGroupContent = {
  id: FormControl<IJogador['id'] | NewJogador['id']>;
  nome: FormControl<IJogador['nome']>;
  posicao: FormControl<IJogador['posicao']>;
  numeroCamisa: FormControl<IJogador['numeroCamisa']>;
  time: FormControl<IJogador['time']>;
};

export type JogadorFormGroup = FormGroup<JogadorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JogadorFormService {
  createJogadorFormGroup(jogador: JogadorFormGroupInput = { id: null }): JogadorFormGroup {
    const jogadorRawValue = {
      ...this.getFormDefaults(),
      ...jogador,
    };
    return new FormGroup<JogadorFormGroupContent>({
      id: new FormControl(
        { value: jogadorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(jogadorRawValue.nome, {
        validators: [Validators.required],
      }),
      posicao: new FormControl(jogadorRawValue.posicao),
      numeroCamisa: new FormControl(jogadorRawValue.numeroCamisa),
      time: new FormControl(jogadorRawValue.time),
    });
  }

  getJogador(form: JogadorFormGroup): IJogador | NewJogador {
    return form.getRawValue() as IJogador | NewJogador;
  }

  resetForm(form: JogadorFormGroup, jogador: JogadorFormGroupInput): void {
    const jogadorRawValue = { ...this.getFormDefaults(), ...jogador };
    form.reset(
      {
        ...jogadorRawValue,
        id: { value: jogadorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JogadorFormDefaults {
    return {
      id: null,
    };
  }
}
