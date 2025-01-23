import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICampeonato } from '../campeonato.model';
import { CampeonatoService } from '../service/campeonato.service';
import { CampeonatoFormGroup, CampeonatoFormService } from './campeonato-form.service';

@Component({
  selector: 'jhi-campeonato-update',
  templateUrl: './campeonato-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CampeonatoUpdateComponent implements OnInit {
  isSaving = false;
  campeonato: ICampeonato | null = null;

  protected campeonatoService = inject(CampeonatoService);
  protected campeonatoFormService = inject(CampeonatoFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CampeonatoFormGroup = this.campeonatoFormService.createCampeonatoFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ campeonato }) => {
      this.campeonato = campeonato;
      if (campeonato) {
        this.updateForm(campeonato);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const campeonato = this.campeonatoFormService.getCampeonato(this.editForm);
    if (campeonato.id !== null) {
      this.subscribeToSaveResponse(this.campeonatoService.update(campeonato));
    } else {
      this.subscribeToSaveResponse(this.campeonatoService.create(campeonato));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICampeonato>>): void {
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

  protected updateForm(campeonato: ICampeonato): void {
    this.campeonato = campeonato;
    this.campeonatoFormService.resetForm(this.editForm, campeonato);
  }
}
