import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITime } from 'app/entities/time/time.model';
import { TimeService } from 'app/entities/time/service/time.service';
import { ICampeonato } from 'app/entities/campeonato/campeonato.model';
import { CampeonatoService } from 'app/entities/campeonato/service/campeonato.service';
import { PartidaService } from '../service/partida.service';
import { IPartida } from '../partida.model';
import { PartidaFormGroup, PartidaFormService } from './partida-form.service';

@Component({
  selector: 'jhi-partida-update',
  templateUrl: './partida-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PartidaUpdateComponent implements OnInit {
  isSaving = false;
  partida: IPartida | null = null;

  timesSharedCollection: ITime[] = [];
  campeonatoesSharedCollection: ICampeonato[] = [];

  protected partidaService = inject(PartidaService);
  protected partidaFormService = inject(PartidaFormService);
  protected timeService = inject(TimeService);
  protected campeonatoService = inject(CampeonatoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PartidaFormGroup = this.partidaFormService.createPartidaFormGroup();

  compareTime = (o1: ITime | null, o2: ITime | null): boolean => this.timeService.compareTime(o1, o2);

  compareCampeonato = (o1: ICampeonato | null, o2: ICampeonato | null): boolean => this.campeonatoService.compareCampeonato(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partida }) => {
      this.partida = partida;
      if (partida) {
        this.updateForm(partida);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const partida = this.partidaFormService.getPartida(this.editForm);
    if (partida.id !== null) {
      this.subscribeToSaveResponse(this.partidaService.update(partida));
    } else {
      this.subscribeToSaveResponse(this.partidaService.create(partida));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPartida>>): void {
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

  protected updateForm(partida: IPartida): void {
    this.partida = partida;
    this.partidaFormService.resetForm(this.editForm, partida);

    this.timesSharedCollection = this.timeService.addTimeToCollectionIfMissing<ITime>(this.timesSharedCollection, ...(partida.times ?? []));
    this.campeonatoesSharedCollection = this.campeonatoService.addCampeonatoToCollectionIfMissing<ICampeonato>(
      this.campeonatoesSharedCollection,
      partida.campeonato,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.timeService
      .query()
      .pipe(map((res: HttpResponse<ITime[]>) => res.body ?? []))
      .pipe(map((times: ITime[]) => this.timeService.addTimeToCollectionIfMissing<ITime>(times, ...(this.partida?.times ?? []))))
      .subscribe((times: ITime[]) => (this.timesSharedCollection = times));

    this.campeonatoService
      .query()
      .pipe(map((res: HttpResponse<ICampeonato[]>) => res.body ?? []))
      .pipe(
        map((campeonatoes: ICampeonato[]) =>
          this.campeonatoService.addCampeonatoToCollectionIfMissing<ICampeonato>(campeonatoes, this.partida?.campeonato),
        ),
      )
      .subscribe((campeonatoes: ICampeonato[]) => (this.campeonatoesSharedCollection = campeonatoes));
  }
}
