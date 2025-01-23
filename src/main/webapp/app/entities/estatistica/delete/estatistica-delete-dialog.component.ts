import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEstatistica } from '../estatistica.model';
import { EstatisticaService } from '../service/estatistica.service';

@Component({
  templateUrl: './estatistica-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EstatisticaDeleteDialogComponent {
  estatistica?: IEstatistica;

  protected estatisticaService = inject(EstatisticaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estatisticaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
