import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe } from 'app/shared/date';
import { ICampeonato } from '../campeonato.model';

@Component({
  selector: 'jhi-campeonato-detail',
  templateUrl: './campeonato-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatePipe],
})
export class CampeonatoDetailComponent {
  campeonato = input<ICampeonato | null>(null);

  previousState(): void {
    window.history.back();
  }
}
