import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJogador } from 'app/entities/jogador/jogador.model';
import { JogadorService } from 'app/entities/jogador/service/jogador.service';
import { IPartida } from 'app/entities/partida/partida.model';
import { PartidaService } from 'app/entities/partida/service/partida.service';
import { EstatisticaService } from '../service/estatistica.service';
import { IEstatistica } from '../estatistica.model';
import { EstatisticaFormGroup, EstatisticaFormService } from './estatistica-form.service';

@Component({
  selector: 'jhi-estatistica-update',
  templateUrl: './estatistica-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EstatisticaUpdateComponent implements OnInit {
  isSaving = false;
  estatistica: IEstatistica | null = null;

  jogadorsSharedCollection: IJogador[] = [];
  partidasSharedCollection: IPartida[] = [];

  protected estatisticaService = inject(EstatisticaService);
  protected estatisticaFormService = inject(EstatisticaFormService);
  protected jogadorService = inject(JogadorService);
  protected partidaService = inject(PartidaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EstatisticaFormGroup = this.estatisticaFormService.createEstatisticaFormGroup();

  compareJogador = (o1: IJogador | null, o2: IJogador | null): boolean => this.jogadorService.compareJogador(o1, o2);

  comparePartida = (o1: IPartida | null, o2: IPartida | null): boolean => this.partidaService.comparePartida(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estatistica }) => {
      this.estatistica = estatistica;
      if (estatistica) {
        this.updateForm(estatistica);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estatistica = this.estatisticaFormService.getEstatistica(this.editForm);
    if (estatistica.id !== null) {
      this.subscribeToSaveResponse(this.estatisticaService.update(estatistica));
    } else {
      this.subscribeToSaveResponse(this.estatisticaService.create(estatistica));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstatistica>>): void {
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

  protected updateForm(estatistica: IEstatistica): void {
    this.estatistica = estatistica;
    this.estatisticaFormService.resetForm(this.editForm, estatistica);

    this.jogadorsSharedCollection = this.jogadorService.addJogadorToCollectionIfMissing<IJogador>(
      this.jogadorsSharedCollection,
      estatistica.jogador,
    );
    this.partidasSharedCollection = this.partidaService.addPartidaToCollectionIfMissing<IPartida>(
      this.partidasSharedCollection,
      estatistica.partida,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.jogadorService
      .query()
      .pipe(map((res: HttpResponse<IJogador[]>) => res.body ?? []))
      .pipe(
        map((jogadors: IJogador[]) => this.jogadorService.addJogadorToCollectionIfMissing<IJogador>(jogadors, this.estatistica?.jogador)),
      )
      .subscribe((jogadors: IJogador[]) => (this.jogadorsSharedCollection = jogadors));

    this.partidaService
      .query()
      .pipe(map((res: HttpResponse<IPartida[]>) => res.body ?? []))
      .pipe(
        map((partidas: IPartida[]) => this.partidaService.addPartidaToCollectionIfMissing<IPartida>(partidas, this.estatistica?.partida)),
      )
      .subscribe((partidas: IPartida[]) => (this.partidasSharedCollection = partidas));
  }
}
