import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPartida } from '../partida.model';
import { PartidaService } from '../service/partida.service';

@Component({
  templateUrl: './partida-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PartidaDeleteDialogComponent {
  partida?: IPartida;

  protected partidaService = inject(PartidaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.partidaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
