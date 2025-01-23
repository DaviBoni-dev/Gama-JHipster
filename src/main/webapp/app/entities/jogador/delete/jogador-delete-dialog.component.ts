import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJogador } from '../jogador.model';
import { JogadorService } from '../service/jogador.service';

@Component({
  templateUrl: './jogador-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JogadorDeleteDialogComponent {
  jogador?: IJogador;

  protected jogadorService = inject(JogadorService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jogadorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
