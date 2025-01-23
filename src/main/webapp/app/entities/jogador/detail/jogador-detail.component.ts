import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IJogador } from '../jogador.model';

@Component({
  selector: 'jhi-jogador-detail',
  templateUrl: './jogador-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class JogadorDetailComponent {
  jogador = input<IJogador | null>(null);

  previousState(): void {
    window.history.back();
  }
}
