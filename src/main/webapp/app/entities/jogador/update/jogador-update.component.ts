import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITime } from 'app/entities/time/time.model';
import { TimeService } from 'app/entities/time/service/time.service';
import { IJogador } from '../jogador.model';
import { JogadorService } from '../service/jogador.service';
import { JogadorFormGroup, JogadorFormService } from './jogador-form.service';

@Component({
  selector: 'jhi-jogador-update',
  templateUrl: './jogador-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JogadorUpdateComponent implements OnInit {
  isSaving = false;
  jogador: IJogador | null = null;

  timesSharedCollection: ITime[] = [];

  protected jogadorService = inject(JogadorService);
  protected jogadorFormService = inject(JogadorFormService);
  protected timeService = inject(TimeService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JogadorFormGroup = this.jogadorFormService.createJogadorFormGroup();

  compareTime = (o1: ITime | null, o2: ITime | null): boolean => this.timeService.compareTime(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jogador }) => {
      this.jogador = jogador;
      if (jogador) {
        this.updateForm(jogador);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jogador = this.jogadorFormService.getJogador(this.editForm);
    if (jogador.id !== null) {
      this.subscribeToSaveResponse(this.jogadorService.update(jogador));
    } else {
      this.subscribeToSaveResponse(this.jogadorService.create(jogador));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJogador>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(jogador: IJogador): void {
    this.jogador = jogador;
    this.jogadorFormService.resetForm(this.editForm, jogador);

    this.timesSharedCollection = this.timeService.addTimeToCollectionIfMissing<ITime>(this.timesSharedCollection, jogador.time);
  }

  protected loadRelationshipsOptions(): void {
    this.timeService
      .query()
      .pipe(map((res: HttpResponse<ITime[]>) => res.body ?? []))
      .pipe(map((times: ITime[]) => this.timeService.addTimeToCollectionIfMissing<ITime>(times, this.jogador?.time)))
      .subscribe((times: ITime[]) => (this.timesSharedCollection = times));
  }
}
