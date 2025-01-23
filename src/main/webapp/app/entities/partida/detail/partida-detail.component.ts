import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe } from 'app/shared/date';
import { IPartida } from '../partida.model';

@Component({
  selector: 'jhi-partida-detail',
  templateUrl: './partida-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatePipe],
})
export class PartidaDetailComponent {
  partida = input<IPartida | null>(null);

  previousState(): void {
    window.history.back();
  }
}
