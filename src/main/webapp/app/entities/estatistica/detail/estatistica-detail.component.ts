import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IEstatistica } from '../estatistica.model';

@Component({
  selector: 'jhi-estatistica-detail',
  templateUrl: './estatistica-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class EstatisticaDetailComponent {
  estatistica = input<IEstatistica | null>(null);

  previousState(): void {
    window.history.back();
  }
}
