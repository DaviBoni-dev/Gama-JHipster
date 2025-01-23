import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICampeonato } from '../campeonato.model';
import { CampeonatoService } from '../service/campeonato.service';

@Component({
  templateUrl: './campeonato-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CampeonatoDeleteDialogComponent {
  campeonato?: ICampeonato;

  protected campeonatoService = inject(CampeonatoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.campeonatoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
