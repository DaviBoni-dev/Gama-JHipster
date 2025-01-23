import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPartida } from 'app/entities/partida/partida.model';
import { PartidaService } from 'app/entities/partida/service/partida.service';
import { ITime } from '../time.model';
import { TimeService } from '../service/time.service';
import { TimeFormGroup, TimeFormService } from './time-form.service';

@Component({
  selector: 'jhi-time-update',
  templateUrl: './time-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TimeUpdateComponent implements OnInit {
  isSaving = false;
  time: ITime | null = null;

  partidasSharedCollection: IPartida[] = [];

  protected timeService = inject(TimeService);
  protected timeFormService = inject(TimeFormService);
  protected partidaService = inject(PartidaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TimeFormGroup = this.timeFormService.createTimeFormGroup();

  comparePartida = (o1: IPartida | null, o2: IPartida | null): boolean => this.partidaService.comparePartida(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ time }) => {
      this.time = time;
      if (time) {
        this.updateForm(time);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const time = this.timeFormService.getTime(this.editForm);
    if (time.id !== null) {
      this.subscribeToSaveResponse(this.timeService.update(time));
    } else {
      this.subscribeToSaveResponse(this.timeService.create(time));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITime>>): void {
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

  protected updateForm(time: ITime): void {
    this.time = time;
    this.timeFormService.resetForm(this.editForm, time);

    this.partidasSharedCollection = this.partidaService.addPartidaToCollectionIfMissing<IPartida>(
      this.partidasSharedCollection,
      ...(time.partidas ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.partidaService
      .query()
      .pipe(map((res: HttpResponse<IPartida[]>) => res.body ?? []))
      .pipe(
        map((partidas: IPartida[]) =>
          this.partidaService.addPartidaToCollectionIfMissing<IPartida>(partidas, ...(this.time?.partidas ?? [])),
        ),
      )
      .subscribe((partidas: IPartida[]) => (this.partidasSharedCollection = partidas));
  }
}
